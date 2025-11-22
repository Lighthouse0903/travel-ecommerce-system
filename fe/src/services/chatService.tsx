import { useFetchInstance } from "@/hooks/fetchInstance";
import { SendMessageRequest, SendMessageResponse } from "@/types/chat";
import { ApiResponse } from "@/types/common";

export const useChatService = () => {
  const { get, post, put, patch, del } = useFetchInstance();

  // hàm tạo mới 1 tin nhắn
  const createMessage = (
    payload: SendMessageRequest
  ): Promise<ApiResponse<SendMessageResponse>> => {
    return post<SendMessageResponse>("/messages/send/", payload, true);
  };

  return { createMessage };
};
