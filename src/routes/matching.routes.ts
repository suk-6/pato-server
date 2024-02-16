import { Elysia, t } from "elysia";
import jwt from "@elysiajs/jwt";
import bearer from "@elysiajs/bearer";
import { JWTPayloadModel } from "../models";
import { MatchingController } from "../controllers/matching.controller";

const matchingController = new MatchingController();

const matchingRoutes = new Elysia({ name: "Matching Routes" }).group(
	"/matching",
	(app) =>
		app
			.use(
				jwt({
					name: "jwt",
					secret: process.env.JWT_SECRET as string,
				})
			)
			.use(bearer())
			.get(
				"/start",
				async ({ bearer, jwt }) => {
					if (bearer === undefined)
						throw new Error("Token is not provided");

					const payload = await jwt.verify(bearer);
					const uuid = (payload as unknown as JWTPayloadModel).uuid;
					if (uuid === undefined)
						throw new Error("UUID is not provided");

					return await matchingController.startMatching(uuid);
				},
				{
					headers: t.Object({
						authorization: t.String(),
					}),
					response: t.Object({
						status: t.String(),
						matchingID: t.Optional(t.String()),
						chatID: t.Optional(t.String()),
					}),
					detail: {
						tags: ["Matching"],
						description:
							"매칭 시작, 바로 매칭 시 chatID 반환, 아니면 matchingID 반환. \
							matchingID를 통해 /matching/waiting으로 소켓 연결",
					},
				}
			)
);

export default matchingRoutes;
