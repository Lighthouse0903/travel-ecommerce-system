//
"use client";

import React from "react";
import { useParams } from "next/navigation";
import ChatRoom from "@/components/common/chat/ChatRoom";

export default function ConversationPage() {
  const params = useParams<{ conv_id: string }>();
  const convId = params.conv_id;

  return <ChatRoom convId={convId} />;
}
