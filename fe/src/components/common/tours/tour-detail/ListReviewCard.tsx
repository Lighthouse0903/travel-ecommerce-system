"use client";

import { ReviewResponse } from "@/types/review";
import { MoreHorizontal, Pencil, Star, Trash2 } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useReviewService } from "@/services/reviewService";
import { toast } from "sonner";
import StarRating from "../../rating/StarRating";
import { formatDate } from "@/utils/formatDate";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import EditReviewRow from "@/components/customer/review/EditReviewRow";
import ConfirmDeleteDialog from "../../dialogs/ConfirmDeleteDialog";

interface ListReviewCardProps {
  tourId: string;
}

const ListReviewCard: React.FC<ListReviewCardProps> = ({ tourId }) => {
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { user } = useAuth();
  const { getListReviewTour, updateReview, deleteReview } = useReviewService();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getListReviewTour(tourId);

        if (res.success) {
          setReviews(res.data ?? []);
        } else {
          const msg =
            typeof res.error?.message === "string"
              ? res.error.message
              : "Lỗi không xác định";
          toast.error(msg);
        }
        console.log("API review response: ", res);
      } catch (err) {
        toast.error("Lỗi server, vui lòng thử lại sau");
      }
    };
    fetchData();
  }, [tourId]);

  // Tính rating trung bình
  const avgRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + (r.rating ?? 0), 0);
    return Number((sum / reviews.length).toFixed(1));
  }, [reviews]);

  // hàm xóa review
  const handleDelete = async (id: string) => {
    const res = await deleteReview(id);
    console.log("API delete review trả về: ", res);

    if (res.success) {
      setReviews((prev) => prev.filter((r) => r.review_id !== id));
      toast.success("Đã xóa đánh giá");
    } else {
      const msg =
        typeof res.error?.message === "string"
          ? res.error.message
          : "Xóa đánh giá thất bại";
      toast.error(msg);
    }
  };

  // hàm cập nhật comment
  const handleUpdate = async (review_id: string, comment: string) => {
    const res = await updateReview(review_id, { comment });

    if (res.success) {
      toast.success("Đã cập nhật bình luận");
      return true;
    }

    const msg =
      typeof res.error?.message === "string"
        ? res.error.message
        : "Cập nhật bình luận thất bại";

    toast.error(msg);
    return false;
  };

  return (
    <section className="bg-slate-50 p-5 rounded-xl border shadow-md space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-xl font-semibold">Bình luận & Đánh giá</h3>
        <span>({reviews.length})</span>

        {reviews.length > 0 && (
          <div className="flex items-center gap-1 text-yellow-500 font-semibold">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            {avgRating}
          </div>
        )}
      </div>

      {reviews.length === 0 && (
        <p className="text-sm text-slate-500">Chưa có đánh giá nào.</p>
      )}

      {/* Danh sách */}
      <div className="space-y-4">
        {reviews.map((review) => {
          const isOwner = user?.user_id === review.user_id;
          const isEditing = editingId === review.review_id;

          return (
            <div
              key={review.review_id}
              className="relative flex gap-3 border rounded-lg p-3 bg-white w-full"
            >
              {/* Avatar */}
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-700 flex-shrink-0">
                {review.customer_name?.charAt(0).toUpperCase()}
              </div>

              {/* Nội dung */}
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-semibold text-sm">
                    {review.customer_name}
                  </div>

                  {/* Ngày */}
                  <div className="text-xs text-slate-400">
                    {review.created_at ? formatDate(review.created_at) : ""}
                  </div>
                </div>

                {isEditing ? (
                  <EditReviewRow
                    review={review}
                    onCancel={() => setEditingId(null)}
                    onSave={async (newComment) => {
                      const ok = await handleUpdate(
                        review.review_id!,
                        newComment
                      );

                      if (ok) {
                        setReviews((prev) =>
                          prev.map((r) =>
                            r.review_id === review.review_id
                              ? { ...r, comment: newComment }
                              : r
                          )
                        );

                        setEditingId(null);
                      }
                    }}
                  />
                ) : (
                  <>
                    <StarRating stars={review.rating ?? 0} />
                    <p className="text-sm text-slate-700">{review.comment}</p>
                  </>
                )}
              </div>

              {isOwner && !isEditing && (
                <div className="absolute bottom-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => setEditingId(review.review_id!)}
                      >
                        <Pencil className="w-4 h-4 mr-2 text-blue-600" /> Chỉnh
                        sửa
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => setDeleteId(review.review_id!)}
                        className="text-red-600 focus:text-red-700"
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> Xóa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Dialog xác nhận xóa */}
      <ConfirmDeleteDialog
        open={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) handleDelete(deleteId);
          setDeleteId(null);
        }}
        title="Bạn có chắc chắn muốn xóa đánh giá này?"
        description="Hành động này không thể hoàn tác. Bình luận sẽ bị xóa vĩnh viễn khỏi tour."
      />
    </section>
  );
};

export default ListReviewCard;
