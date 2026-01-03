"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

const Section: React.FC<Props> = ({ title, description, children }) => {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default Section;
