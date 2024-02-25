import { Elysia, t } from "elysia";
import jwt from "@elysiajs/jwt";
import { JWTPayloadModel } from "../models";
import { MatchingController } from "../controllers/matching.controller";

const matchingController = new MatchingController();

const matchingSocketRoutes = new Elysia({
	name: "Matching Socket Routes",
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
	.ws("/matching/waiting", {
		async open(ws) {
			const userToken = ws.data.headers.authorization?.split(" ")[1];
			if (userToken === undefined) {
				ws.send({ status: false, message: "Token is not provided" });
				ws.close();
			}
			const payload = await ws.data.jwt.verify(userToken);
			if (payload === undefined) throw new Error("UUID is not provided");

			ws.id = (payload as unknown as JWTPayloadModel).uuid;
			ws.send(await matchingController.waitingSocket(ws.id));
		},
		async close(ws) {
			matchingController.cancelMatching(ws.id);
		},
	});

export default matchingSocketRoutes;
