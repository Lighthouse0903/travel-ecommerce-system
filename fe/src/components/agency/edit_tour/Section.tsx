"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  title: string;
  description?: string;
  children: React.ReactNode;
  rightSlot?: React.ReactNode;
};

const Section: React.FC<Props> = ({
  title,
  description,
  children,
  rightSlot,
}) => {
  return (
    <Card className="rounded-2xl p-0">
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div className="space-y-1">
          <CardTitle className="text-lg">{title}</CardTitle>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>

        {rightSlot ? <div className="shrink-0">{rightSlot}</div> : null}
      </CardHeader>

      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default Section;
