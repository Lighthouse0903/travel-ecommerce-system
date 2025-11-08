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

    def save_model(self, request, obj, form, change):
        old_status = None
        if change:
            old_status = Agency.objects.get(pk=obj.pk).status

        super().save_model(request, obj, form, change)

        if change and old_status != obj.status:
            recipient = obj.email_agency or (obj.user.email if getattr(obj, "user", None) else None)
            if not recipient:
                self.message_user(request, f"No valid email for {obj.agency_name}", messages.WARNING)
                return

            if obj.status == 'approved':
                obj.verified = True
                obj.reason_rejected = None
                obj.save(update_fields=['verified', 'reason_rejected'])

                def send_approval():
                    try:
                        send_mail(
                            subject="Agency Registration Approved",
                            message=f"Dear {obj.agency_name}, your registration has been approved.",
                            from_email=settings.DEFAULT_FROM_EMAIL,
                            recipient_list=[recipient],
                            fail_silently=False,
                        )
                    except Exception as e:
                        print(f"[ADMIN save_model] Approve mail failed: {e}")

                transaction.on_commit(send_approval)

            elif obj.status == 'rejected':
                obj.verified = False
                obj.save(update_fields=['verified'])

                def send_reject():
                    try:
                        send_mail(
                            subject="Agency Registration Rejected",
                            message=f"Dear {obj.agency_name}, your registration was rejected.\nReason: {obj.reason_rejected or ''}",
                            from_email=settings.DEFAULT_FROM_EMAIL,
                            recipient_list=[recipient],
                            fail_silently=False,
                        )
                    except Exception as e:
                        print(f"[ADMIN save_model] Reject mail failed: {e}")

                transaction.on_commit(send_reject)

    def approve_agencies(self, request, queryset):
        sent_count = 0
        for agency in queryset:
            agency.status = 'approved'
            agency.reason_rejected = None
            agency.verified = True
            agency.save()

            recipient = agency.email_agency or (agency.user.email if agency.user else None)
            if recipient:
                def send_approval_mail():
                    try:
                        send_mail(
                            subject="Agency Registration Approved",
                            message=f"Dear {agency.agency_name}, your registration has been approved.",
                            from_email=settings.DEFAULT_FROM_EMAIL,
                            recipient_list=[recipient],
                            fail_silently=False,
                        )
                    except Exception as e:
                        print(f"[ADMIN action] Approve mail failed ({agency.agency_name}): {e}")

                transaction.on_commit(send_approval_mail)
                sent_count += 1
            else:
                self.message_user(request, f"No valid email for {agency.agency_name}", messages.WARNING)

        self.message_user(
            request,
            f"{queryset.count()} agency(ies) approved successfully, {sent_count} email(s) queued to send."
        )
    approve_agencies.short_description = 'Approve selected agencies'

    def reject_agencies(self, request, queryset):
        if "apply" in request.POST:
            form = RejectForm(request.POST)
            if form.is_valid():
                reason = form.cleaned_data["reason"]
                sent_count = 0
                for agency in queryset:
                    agency.status = "rejected"
                    agency.reason_rejected = reason
                    agency.verified = False
                    agency.save()

                    recipient = agency.email_agency or (agency.user.email if agency.user else None)
                    if recipient:
                        def send_reject_mail():
                            try:
                                send_mail(
                                    subject="Agency Registration Rejected",
                                    message=f"Dear {agency.agency_name}, your registration was rejected.\nReason: {reason}",
                                    from_email=settings.DEFAULT_FROM_EMAIL,
                                    recipient_list=[recipient],
                                    fail_silently=False,
                                )
                            except Exception as e:
                                print(f"[ADMIN action] Reject mail failed ({agency.agency_name}): {e}")

                        transaction.on_commit(send_reject_mail)
                        sent_count += 1
                    else:
                        self.message_user(request, f"No valid email for {agency.agency_name}", messages.WARNING)

                self.message_user(
                    request,
                    f"{queryset.count()} agency(ies) rejected. {sent_count} email(s) queued to send."
                )
                return None
        else:
            form = RejectForm(initial={'_selected_action': queryset.values_list('agency_id', flat=True)})

        return render(
            request,
            "admin/reject_reason_form.html",
            {"objects": queryset, "form": form, "action": "Reject selected agencies"},
        )
    reject_agencies.short_description = "Reject selected agencies (with reason)"
