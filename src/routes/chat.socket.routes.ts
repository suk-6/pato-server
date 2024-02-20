import { Elysia } from "elysia";

const chatSocketRoutes = new Elysia({
	name: "Chat Socket Routes",
	websocket: {
		idleTimeout: 10000,
	},
}).ws("/chat", {
	open(ws) {
		console.log(ws.id);
		ws.subscribe("chat");
	},
	async message(ws, message) {
		console.log(message);
		if (message === "chat") {
			ws.publish("chat", "chat");
		}
	},
});

export default chatSocketRoutes;
