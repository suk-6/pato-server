import { ChatService } from "../services/chat.service";
import { ChatMessageModel } from "../models";

const chatService = new ChatService();

export class ChatController {
	async createChat(uuid1: string, uuid2: string) {
		await chatService.createChatroom(uuid1, uuid2);
	}

	async joinChat(uuid: string) {
		return await chatService.joinChat(uuid);
	}

	async getChatroomID(uuid: string) {
		const chatroomUser = await chatService.getChatroomUser(uuid);
		if (chatroomUser === null) throw new Error("Chatroom not found");

		return chatroomUser.crid;
	}

	async leaveChat(uuid: string) {
		const chatroomUser = await chatService.getChatroomUser(uuid);
		if (chatroomUser === null) throw new Error("Chatroom not found");

		chatService.leaveChat(uuid);

		return chatroomUser.crid;
	}

	async sendMessage(chatroomID: number, senderUuid: string, message: string) {
		const chatroom = await chatService.getChatroom(chatroomID);
		if (chatroom === null)
			return { status: false, message: "Chatroom not found" };

		const chatroomUser = await chatService.getChatroomUser(senderUuid);
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
