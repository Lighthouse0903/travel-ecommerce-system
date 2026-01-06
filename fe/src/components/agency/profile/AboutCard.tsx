"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  description?: string | null;
}

const AboutCard: React.FC<Props> = ({ description }) => {
  const hasContent = description?.trim();

  return (
    <Card className="rounded-2xl border border-slate-200 bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-slate-900">Giới thiệu</CardTitle>
      </CardHeader>

      <CardContent className="text-sm text-slate-600 leading-relaxed">
        {hasContent ? description : "Bạn chưa cập nhật thông tin này."}
      </CardContent>
    </Card>
  );
};

export default AboutCard;
