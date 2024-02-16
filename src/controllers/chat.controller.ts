import { ChatService } from "../services/chat.service";

const chatService = new ChatService();

export class ChatController {
	async createChat(uuid1: string, uuid2: string) {
		return await chatService.createChat(uuid1, uuid2);
	}
}
