"use client";

import React from "react";
import { UserResponse } from "@/types/user";

interface Props {
  user?: UserResponse | null;
}

const CustomerInfoCard: React.FC<Props> = ({ user }) => {
  return (
    <section className="bg-white rounded-2xl shadow-sm border p-5 space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">
        Thông tin người đặt tour
      </h2>

      <div className="space-y-2 text-sm text-gray-700">
        <div className="flex justify-between">
          <span className="text-gray-500">Họ và tên</span>
          <span className="font-medium text-gray-900">
            {user?.full_name ?? "—"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Số điện thoại</span>
          <span className="font-medium text-gray-900">
            {user?.phone ?? "—"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Email</span>
          <span className="font-medium text-gray-900">
            {user?.email ?? "—"}
          </span>
        </div>
      </div>
    </section>
  );
};

export default CustomerInfoCard;
