export interface UserSummary {
  user_id: string;
  full_name: string | null;
  is_online: boolean;
  username: string;
}

export interface MessageSummary {
  message_id: string;
  sender: UserSummary;
  content: string | null;
  is_read?: boolean;
  created_at: string;
}

export interface ConversationSummary {
  conversation_id: string;
  partner: UserSummary | null;
  last_message: MessageSummary | null;
  updated_at: string;
  unread_count: number;
}

export interface ConversationDetai {
  conversation: string;
  user1: UserSummary;
  user2: UserSummary;
  created_at: string;
  updated_at: string;
}
