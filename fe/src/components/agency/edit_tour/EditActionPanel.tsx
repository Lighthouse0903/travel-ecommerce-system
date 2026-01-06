"use client";

import React, { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { AlertTriangle, Save, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { EditTourFormValues } from "@/types/tour";

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

  const statusText = useMemo(
    () => (isActive ? "Đang hoạt động" : "Đang tạm ẩn"),
    [isActive]
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-0.5">
          <h3 className="text-sm font-semibold text-foreground">
            Trạng thái &amp; Hành động
          </h3>
          <p className="text-xs text-muted-foreground">Hiển thị trên web</p>
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

      {/* Status */}
      <div className="flex items-center justify-between rounded-xl border border-border bg-background px-3 py-2">
        <span className="text-sm font-medium text-foreground">
          {statusText}
        </span>
        <span className="text-xs text-muted-foreground">
          {isActive ? "Đang bật" : "Đang tắt"}
        </span>
      </div>

      {/* Dirty hint */}
      {formState.isDirty ? (
        <div className="rounded-xl border border-border bg-background px-3 py-2">
          <div className="flex items-center gap-2 text-foreground">
            <AlertTriangle className="h-4 w-4 text-primary" />
            <p className="text-xs font-medium">Có thay đổi chưa được lưu</p>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-background px-3 py-2">
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
          className="h-11 w-full rounded-xl"
        >
          <Save className="mr-2 h-4 w-4" />
          {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="h-11 w-full rounded-xl"
        >
          <X className="mr-2 h-4 w-4" />
          Hủy
        </Button>
      </div>
    </div>
  );
};

export default EditActionsPanel;
