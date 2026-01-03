"use client";

import React, { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { AlertTriangle, Save, X } from "lucide-react";

import type { EditTourFormValues } from "@/app/agency/dashboard/tours/[id]/edit/formSchema";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

type Props = {
  formId: string;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (values: EditTourFormValues) => Promise<void> | void;
};

const EditActionsPanel: React.FC<Props> = ({
  formId,
  isSubmitting,
  onCancel,
  onSubmit,
}) => {
  const { watch, setValue, formState, handleSubmit } =
    useFormContext<EditTourFormValues>();

  const isActive = watch("is_active") ?? true;
  const canSave = formState.isDirty && !isSubmitting;
  const submit = handleSubmit(onSubmit);
  const statusText = useMemo(() => {
    return isActive ? "Đang hoạt động" : "Đang tạm ẩn";
  }, [isActive]);

  return (
    <Card className="rounded-2xl border shadow-sm">
      <CardContent className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold leading-none">
              Trạng thái &amp; Hành động
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Hiển thị trên web
            </p>
          </div>

          <Switch
            checked={!!isActive}
            onCheckedChange={(v) =>
              setValue("is_active", !!v, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            aria-label="Bật/tắt trạng thái tour"
          />
        </div>

        {/* Status line */}
        <div className="flex items-center justify-between">
          <span
            className={`text-sm font-medium ${
              isActive ? "text-emerald-600" : "text-gray-500"
            }`}
          >
            {statusText}
          </span>

          {/* hint nhỏ */}
          <span className="text-xs text-muted-foreground">
            {isActive ? "Đang bật" : "Đang tắt"}
          </span>
        </div>

        {/* Dirty warning */}
        {formState.isDirty ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2">
            <div className="flex items-center gap-2 text-amber-700">
              <AlertTriangle className="h-4 w-4" />
              <p className="text-xs font-medium">Có thay đổi chưa được lưu</p>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border bg-muted/40 px-3 py-2">
            <p className="text-xs text-muted-foreground">
              Không có thay đổi cần lưu.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2">
          <Button
            type="button"
            form={formId}
            onClick={submit}
            disabled={!canSave}
            className="w-full rounded-xl h-11"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="w-full rounded-xl h-11"
          >
            <X className="h-4 w-4 mr-2" />
            Hủy
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EditActionsPanel;
