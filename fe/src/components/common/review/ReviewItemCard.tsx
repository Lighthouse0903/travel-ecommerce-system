"use client";

import React, { useMemo, useState } from "react";
import { MoreVertical, Pencil, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { ReviewResponse } from "@/types/review";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ReviewItemCardProps {
  review: ReviewResponse;
  currentUserId?: string | null;

  // callbacks từ ReviewList
  onEdit: (
    review_id: string,
    comment: string
  ) => Promise<{ success: boolean; message?: string }>;
  onDelete: (
    review_id: string
  ) => Promise<{ success: boolean; message?: string }>;
}

const ReviewItemCard = ({
  review,
  currentUserId,
  onEdit,
  onDelete,
}: ReviewItemCardProps) => {
  const isOwner = useMemo(() => {
    if (!currentUserId) return false;
    return review.user_id === currentUserId;
  }, [review.user_id, currentUserId]);

  const firstChar = (
    review.customer_name?.trim()?.charAt(0) || "?"
  ).toUpperCase();

  const [openEdit, setOpenEdit] = useState(false);
  const [editingComment, setEditingComment] = useState(review.comment ?? "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleOpenEdit = () => {
    setEditingComment(review.comment ?? "");
    setOpenEdit(true);
  };

  const handleSave = async () => {
    const trimmed = editingComment.trim();
    if (!trimmed) return;

    setSaving(true);
    const res = await onEdit(review.review_id, trimmed);
    setSaving(false);

    if (!res.success) {
      toast.error(res.message || "Cập nhật thất bại");
      return;
    }

    toast.success(res.message || "Đã cập nhật");
    setOpenEdit(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    const res = await onDelete(review.review_id);
    setDeleting(false);

    if (!res.success) {
      toast.error(res.message || "Xóa thất bại");
      return;
    }

    toast.success(res.message || "Đã xóa");
  };

  return (
    <Card className="border shadow-sm">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-semibold">
              {firstChar}
            </div>

            <div className="space-y-1">
              <div className="font-medium">{review.customer_name}</div>
              <div className="text-xs text-muted-foreground">
                {new Date(review.created_at).toLocaleString("vi-VN")}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={
                    "w-4 h-4 " +
                    (i <= review.rating
                      ? "fill-yellow-400 stroke-yellow-400"
                      : "stroke-slate-300")
                  }
                />
              ))}
            </div>

            {isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleOpenEdit}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Chỉnh sửa
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={handleDelete}
                    className="text-red-600 focus:text-red-600"
                    disabled={deleting}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {deleting ? "Đang xóa..." : "Xóa"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        <div className="text-sm leading-relaxed">{review.comment}</div>

        <Dialog open={openEdit} onOpenChange={setOpenEdit}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Chỉnh sửa đánh giá</DialogTitle>
            </DialogHeader>

            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                Bạn chỉ có thể chỉnh sửa nội dung bình luận.
              </div>
              <Textarea
                value={editingComment}
                onChange={(e) => setEditingComment(e.target.value)}
                placeholder="Nhập nội dung..."
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenEdit(false)}>
                Hủy
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving || !editingComment.trim()}
              >
                {saving ? "Đang lưu..." : "Lưu"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ReviewItemCard;
