import { Elysia, t } from "elysia";
import jwt from "@elysiajs/jwt";
import { ChatController } from "../controllers/chat.controller";
import { JWTPayloadModel } from "../models";

const chatController = new ChatController();

const chatSocketRoutes = new Elysia({
	name: "Chat Socket Routes",
	websocket: {
		idleTimeout: 10000,
	},
})
	.use(
		jwt({
			name: "jwt",
			secret: process.env.JWT_SECRET as string,
		})
	)
	.ws("/chat", {
		async message(ws, { type, chatToken, data }) {
			const userToken = ws.data.headers.authorization?.split(" ")[1];
			if (userToken === undefined) {
				ws.send({ status: false, message: "Token is not provided" });
				ws.close();
			}
			const payload = await ws.data.jwt.verify(userToken);
			const uuid = (payload as unknown as JWTPayloadModel).uuid;

			if (type === "connect") {
				const result = await chatController.joinChat(chatToken);
				if (result.status === false) {
					ws.send(result);
				} else if (result.crid !== undefined) {
					ws.subscribe(result.crid.toString());
				} else {
					ws.send(result);
					ws.close();
				}
			} else if (type === "chat") {
				if (data === undefined) {
					ws.send({ status: false, message: "Data is not provided" });
					ws.close();
				} else {
					const chatroomID = await chatController.getChatroomID(
						chatToken
					);
					const result = chatController.sendMessage(
						chatroomID,
						chatToken,
						data
					);
					ws.publish(chatroomID.toString(), result);
				}
			} else if (type === "disconnect") {
				const chatroomID = await chatController.leaveChat(chatToken);
				ws.unsubscribe(chatroomID.toString());
				ws.close();
			} else return { status: false, message: "Type is not provided" };
		},
		// async close(ws) {
		// 	const chatToken = ws.chatToken;
		// 	if (chatToken !== undefined) {
		// 		const chatroomID = await chatController.leaveChat(chatToken);
		// 		ws.unsubscribe(chatroomID.toString());
		// 	}
		// },

		body: t.Object({
			type: t.String(),
			chatToken: t.String(),
			data: t.Optional(t.String()),
		}),
	});

export default chatSocketRoutes;
