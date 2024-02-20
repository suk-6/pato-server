import db from "../db";
import { ChatroomUserModel } from "../models";

export class ChatService {
	async createChatroom(chatTokens: string[], uuid1: string, uuid2: string) {
		const chatroom = await db.chatroom.create({
			data: {},
		});
		const chatroomID = chatroom.crid;

		const participant1: ChatroomUserModel = {
			crid: chatroomID,
			uuid: uuid1,
			chatToken: chatTokens[0],
		};
		const participant2: ChatroomUserModel = {
			crid: chatroomID,
			uuid: uuid2,
			chatToken: chatTokens[1],
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

	async joinChat(chatToken: string) {
		const chatroomUser = await db.chatroomUser.findFirst({
			where: {
				chatToken: chatToken,
			},
		});

		if (chatroomUser === null) throw new Error("Chatroom not found");

		db.chatroomUser.update({
			where: {
				cuid: chatroomUser.cuid,
			},
			data: {
				status: 1,
			},
		});

		return chatroomUser.crid;
	}

	async getChatroomUser(chatToken: string) {
		return await db.chatroomUser.findFirst({
			where: {
				chatToken: chatToken,
			},
		});
	}

	async leaveChat(chatToken: string) {
		const chatroomUser = await db.chatroomUser.findFirst({
			where: {
				chatToken: chatToken,
			},
		});

		if (chatroomUser === null) throw new Error("Chatroom not found");

		db.chatroomUser.update({
			where: {
				cuid: chatroomUser.cuid,
			},
			data: {
				status: 2,
			},
		});

		return chatroomUser.crid;
	}
}
