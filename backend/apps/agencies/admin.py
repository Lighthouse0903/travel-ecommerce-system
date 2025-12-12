from django.contrib import admin, messages
from django.core.mail import send_mail
from django.conf import settings
from django import forms
from django.shortcuts import render
from django.db import transaction
from .models import Agency


class AgencyAdminForm(forms.ModelForm):
    class Meta:
        model = Agency
        fields = "__all__"

    def clean(self):
        cleaned = super().clean()
        if cleaned.get("status") == "rejected" and not cleaned.get("reason_rejected"):
            raise forms.ValidationError("Reason is required when rejecting.")
        return cleaned


class RejectForm(forms.Form):
    _selected_action = forms.CharField(widget=forms.MultipleHiddenInput)
    reason = forms.CharField(widget=forms.Textarea, label="Reason for rejection")


@admin.register(Agency)
class AgencyAdmin(admin.ModelAdmin):
    form = AgencyAdminForm

    list_display = ('agency_name', 'user', 'license_number', 'status', 'verified', 'created_at')
    list_filter = ('status', 'verified')
    search_fields = ('agency_name', 'user__username', 'license_number')
    actions = ['approve_agencies', 'reject_agencies']


    def _approve_agency(self, agency):
        agency.status = "approved"
        agency.reason_rejected = None
        agency.verified = True
        agency.save(update_fields=["status", "reason_rejected", "verified"])

        # --- Update user role ---
        user = agency.user
        roles = user.roles or []

        if getattr(user, "PROVIDER", None) is None:
            print("⚠ WARNING: user.PROVIDER does not exist")
        else:
            if user.PROVIDER not in roles:
                user.roles = roles + [user.PROVIDER]
                user.save(update_fields=["roles"])

        # Send email
        recipient = agency.email_agency or (agency.user.email if agency.user else None)
        if recipient:
            def send_mail_async():
                send_mail(
                    subject="Agency Registration Approved",
                    message=f"Dear {agency.agency_name}, your registration has been approved.",
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[recipient],
                    fail_silently=False,
                )
            transaction.on_commit(send_mail_async)

    def _reject_agency(self, agency, reason):
        agency.status = "rejected"
        agency.reason_rejected = reason
        agency.verified = False
        agency.save(update_fields=["status", "reason_rejected", "verified"])

        recipient = agency.email_agency or (agency.user.email if agency.user else None)
        if recipient:
            def send_mail_async():
                send_mail(
                    subject="Agency Registration Rejected",
                    message=f"Dear {agency.agency_name}, your registration was rejected.\nReason: {reason}",
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[recipient],
                    fail_silently=False,
                )
            transaction.on_commit(send_mail_async)


    def save_model(self, request, obj, form, change):
        old_status = None
        if change:
            old_status = Agency.objects.get(pk=obj.pk).status

        super().save_model(request, obj, form, change)

        if not change or old_status == obj.status:
            return

        if obj.status == "approved":
            self._approve_agency(obj)

        elif obj.status == "rejected":
            self._reject_agency(obj, obj.reason_rejected or "")


    def approve_agencies(self, request, queryset):
        for agency in queryset:
            self._approve_agency(agency)

        self.message_user(request, f"{queryset.count()} agencies approved.")
    approve_agencies.short_description = "Approve selected agencies"


    def reject_agencies(self, request, queryset):
        if "apply" in request.POST:
            form = RejectForm(request.POST)
            if form.is_valid():
                reason = form.cleaned_data["reason"]
                for agency in queryset:
                    self._reject_agency(agency, reason)

                self.message_user(request, f"{queryset.count()} agencies rejected.")
                return None
        else:
            form = RejectForm(initial={'_selected_action': queryset.values_list('agency_id', flat=True)})

        return render(
            request,
            "admin/reject_reason_form.html",
            {"objects": queryset, "form": form, "action": "Reject selected agencies"},
        )
    reject_agencies.short_description = "Reject selected agencies (with reason)"