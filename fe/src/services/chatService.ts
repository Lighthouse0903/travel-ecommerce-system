import { useFetchInstance } from "@/hooks/fetchInstance";
import { ConversationSummary, MessageSummary } from "@/types/chat";
import { ApiResponse } from "@/types/common";

export const useChatService = () => {
  const { get, post } = useFetchInstance();

  // hàm call api lấy danh sách các conversation của 1 người
  const getListConversations = (): Promise<
    ApiResponse<ConversationSummary[]>
  > => {
    return get<ConversationSummary[]>(`/chat/conversations/`, true);
  };

  // hàm call api lấy hoặc tạo mới 1 cuộc hội thoại với 1 người
  const createOrGetConversation = (
    partnerId: string
  ): Promise<ApiResponse<ConversationSummary>> => {
    return post<ConversationSummary>(
      `/chat/conversations/start/`,
      { partner_id: partnerId },
      true
    );
  };

  // hàm call api lấy toàn bộ tin nhắn của 1 cuộc hội thoại:
  const getAllMessagesInConversation = (
    conv_id: string
  ): Promise<ApiResponse<MessageSummary[]>> => {
    return get<MessageSummary[]>(
      `/chat/conversations/${conv_id}/messages/`,
      true
    );
  };

  // interface AIResponse {
  //   answer: string;
  //   response_time: number;
  // }

  // // hàm call api chat bot
  // const chatWithAgent = (message:string)=>{
  //   Promise<AIRes
  // }

  return {
    getListConversations,
    createOrGetConversation,
    getAllMessagesInConversation,
  };
};
