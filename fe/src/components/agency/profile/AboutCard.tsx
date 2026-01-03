"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  description?: string | null;
}

const AboutCard: React.FC<Props> = ({ description }) => {
  const hasContent = description?.trim();

  return (
    <Card className="rounded-xl bg-slate-50 shadow-md">
      <CardHeader>
        <CardTitle>Giới thiệu</CardTitle>
      </CardHeader>

      <CardContent className="text-sm text-muted-foreground leading-relaxed">
        {hasContent ? description : "Bạn chưa cập nhật thông tin này."}
      </CardContent>
    </Card>
  );
};

export default AboutCard;
