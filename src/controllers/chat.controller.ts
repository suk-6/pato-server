import { ChatService } from "../services/chat.service";
import { ChatMessageModel } from "../models";

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

	async sendMessage(chatroomID: number, chatToken: string, message: string) {
		const chatroom = await chatService.getChatroom(chatroomID);
		if (chatroom === null)
			return { status: false, message: "Chatroom not found" };

		const chatroomUser = await chatService.getChatroomUser(chatToken);
		if (chatroomUser === null)
			return { status: false, message: "Chatroom user not found" };

		const chatroomStatus = chatroom.status;
		if (chatroomStatus !== 2)
			return { status: false, message: "Chatroom is not available" };

		const chatMessage: ChatMessageModel = {
			crid: chatroomID,
			cuid: chatroomUser.cuid,
			uuid: chatroomUser.uuid,
			message: message,
		};

		return await chatService.sendMessage(chatMessage);
	}
}
