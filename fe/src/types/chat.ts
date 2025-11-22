export interface SendMessageRequest {
  receiver_id: string;
  content: string;
}

export interface SendMessageResponse {
  message_id: string;
  sender_id: string;
  receiver_id: string;
  sender_name?: string;
  receiver_name?: string;
  content: string;
  created_at: string;
}

export interface ConversationSummary {
  partner_id: string;
  partner_name: string;
  partner_avatar?: string;

  last_message?: string;
  last_time?: string;
  unread_count?: number;

  isOnline?: boolean; // optional
}
