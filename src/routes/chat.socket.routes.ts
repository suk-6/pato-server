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
		async open(ws) {
			const userToken = ws.data.headers.authorization?.split(" ")[1];
			if (userToken === undefined) {
				ws.send({ status: false, message: "Token is not provided" });
				ws.close();
			}
			const payload = await ws.data.jwt.verify(userToken);
			if (payload === undefined) throw new Error("UUID is not provided");

			ws.id = (payload as unknown as JWTPayloadModel).uuid;

			const result = await chatController.joinChat(ws.id);
			if (result.crid !== undefined) {
				ws.subscribe(result.crid.toString());
			} else {
				ws.send(result);
				ws.close();
			}
		},
		async message(ws, { type, data }) {
			if (type === "chat") {
				const chatroomID = await chatController.getChatroomID(ws.id);
				const result = await chatController.sendMessage(
					chatroomID,
					ws.id,
					data
				);
				if (result.status === false) ws.send(result);
				else ws.publish(chatroomID.toString(), result);
			} else ws.send({ status: false, message: "Type is not provided" });
		},
		async close(ws) {
			const chatroomID = await chatController.leaveChat(ws.id);
			ws.unsubscribe(chatroomID.toString());
		},

		body: t.Object({
			type: t.String(),
			data: t.String(),
		}),
	});

export default chatSocketRoutes;
