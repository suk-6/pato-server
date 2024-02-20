import { Elysia, t } from "elysia";
import { ChatController } from "../controllers/chat.controller";

const chatController = new ChatController();

const chatSocketRoutes = new Elysia({
	name: "Chat Socket Routes",
	websocket: {
		idleTimeout: 10000,
	},
}).ws("/chat", {
	async message(ws, { type, chatToken, data }) {
		if (type === "connect") {
			const chatroomID = await chatController.joinChat(chatToken);
			ws.subscribe(chatroomID.toString());
		} else if (type === "chat") {
			if (data === undefined) throw new Error("Chat data is null");
			const chatroomID = await chatController.getChatroomID(chatToken);
			ws.publish(chatroomID.toString(), data);
		} else if (type === "disconnect") {
			const chatroomID = await chatController.leaveChat(chatToken);
			ws.unsubscribe(chatroomID.toString());
		} else throw new Error("Invalid message type");
	},

	body: t.Object({
		type: t.String(),
		chatToken: t.String(),
		data: t.Optional(t.String()),
	}),
});

export default chatSocketRoutes;
