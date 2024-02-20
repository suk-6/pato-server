import { ChatService } from "../services/chat.service";

const chatService = new ChatService();

export class ChatController {
	async createChat(uuid1: string, uuid2: string) {
		const chatTokens = [crypto.randomUUID(), crypto.randomUUID()];
		await chatService.createChatroom(chatTokens, uuid1, uuid2);

		return chatTokens;
	}

	async joinChat(chatToken: string) {
		return await chatService.joinChat(chatToken);
	}

	async getChatroomID(chatToken: string) {
		const chatroomUser = await chatService.getChatroomUser(chatToken);
		if (chatroomUser === null) throw new Error("Chatroom not found");

		return chatroomUser.crid;
	}

	async leaveChat(chatToken: string) {
		const chatroomUser = await chatService.getChatroomUser(chatToken);
		if (chatroomUser === null) throw new Error("Chatroom not found");

		chatService.leaveChat(chatToken);

		return chatroomUser.crid;
	}
}
