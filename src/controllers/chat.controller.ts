import { ChatService } from "../services/chat.service";

const chatService = new ChatService();

export class ChatController {
	async createChat(uuid1: string, uuid2: string) {
		const chatTokens = [crypto.randomUUID(), crypto.randomUUID()];
		await chatService.createChatroom(chatTokens, uuid1, uuid2);

		return chatTokens;
	}
}
