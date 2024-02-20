import db from "../db";
import { ChatroomUserModel, ChatMessageModel } from "../models";

export class ChatService {
	async createChatroom(uuid1: string, uuid2: string) {
		const chatroom = await db.chatroom.create({
			data: {},
		});
		const chatroomID = chatroom.crid;

		const participant1: ChatroomUserModel = {
			crid: chatroomID,
			uuid: uuid1,
		};
		const participant2: ChatroomUserModel = {
			crid: chatroomID,
			uuid: uuid2,
		};

		try {
			await db.chatroomUser.create({
				data: participant1,
			});

			await db.chatroomUser.create({
				data: participant2,
			});
		} catch (e) {
			console.error(e);
			throw new Error("Failed to create chatroom");
		}
	}

	async joinChat(uuid: string) {
		const chatroomUser = await this.getChatroomUser(uuid);
		const chatroom = await this.getChatroom(chatroomUser.crid);
		const chatroomStatus = chatroom.status;

		if (chatroomStatus === 0) {
			await this.changeChatroomStatus(chatroomUser.crid, 1);
		} else if (chatroomStatus === 1) {
			await this.changeChatroomStatus(chatroomUser.crid, 2);
		} else if (chatroomStatus === 2) {
			return { status: false, message: "Chatroom is full" };
		} else if (chatroomStatus === 3) {
			return { status: false, message: "Chatroom is closed" };
		} else {
			return { status: false, message: "Chatroom is not available" };
		}

		return { status: true, crid: chatroomUser.crid };
	}

	async leaveChat(uuid: string) {
		const chatroomUser = await this.getChatroomUser(uuid);
		this.changeChatroomStatus(chatroomUser.crid, 3);

		return chatroomUser.crid;
	}

	async changeChatroomStatus(chatroomID: number, status: number) {
		await db.chatroom.update({
			where: {
				crid: chatroomID,
			},
			data: {
				status: status,
			},
		});
	}

	async getChatroom(chatroomID: number) {
		const chatroom = await db.chatroom.findFirst({
			where: {
				crid: chatroomID,
			},
		});
		if (chatroom === null) throw new Error("Chatroom not found");

		return chatroom;
	}

	async getChatroomUser(uuid: string) {
		const chatroomUser = await db.chatroomUser.findFirst({
			where: {
				uuid: uuid,
			},
			orderBy: {
				cuid: "desc",
			},
		});
		if (chatroomUser === null) throw new Error("Chatroom not found");

		return chatroomUser;
	}

	async sendMessage(chatMessage: ChatMessageModel) {
		await db.chat.create({
			data: chatMessage,
		});

		return { status: true, type: "recivedChat", data: chatMessage.message };
	}
}
