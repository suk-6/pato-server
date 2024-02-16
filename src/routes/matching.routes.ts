import { Elysia, t } from "elysia";
import jwt from "@elysiajs/jwt";
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
			.get(
				"/start",
				async ({ headers, jwt }) => {
					const token = headers["authorization"]?.split(" ")[1];
					if (token === undefined)
						throw new Error("Token is not provided");

					const payload = await jwt.verify(token);
					const uuid = (payload as unknown as JWTPayloadModel).uuid;
					if (uuid === undefined)
						throw new Error("UUID is not provided");

					return matchingController.startMatching(uuid);
				},
				{
					// response: t.Object({
					// 	status: t.String(),
					// 	matchedUuid: t.String(),
					// }),
					detail: {
						tags: ["Matching"],
					},
				}
			)
);

export default matchingRoutes;
