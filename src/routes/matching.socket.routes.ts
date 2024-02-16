import { Elysia, t } from "elysia";
import { MatchingService } from "../services/matching.service";

const matchingService = new MatchingService();

const matchingSocketRoutes = new Elysia({
	name: "Matching Socket Routes",
}).ws("/matching/waiting", {
	async message(ws, message) {
		const chatID = await matchingService.waitingSocket(message as string);
		ws.send(chatID);
	},
});

export default matchingSocketRoutes;
