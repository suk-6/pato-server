import { Elysia, t } from "elysia";
import { oAuthController } from "../controllers/oauth.controller";
import jwt from "@elysiajs/jwt";

const oauthController = new oAuthController();

const oAuthRoutes = new Elysia({ name: "oAuth Routes" }).group(
	"/oauth",
	(app) =>
		app
			.use(
				jwt({
					name: "jwt",
					secret: process.env.JWT_SECRET as string,
				})
			)
			.get("/", () => "oAuth Routes", {
				response: t.String(),
				detail: {
					tags: ["Auth"],
				},
			})
			.get("/kakao/get", () => oauthController.getKakaoAuth(), {
				response: t.String(),
				detail: {
					tags: ["Auth"],
					description: "카카오 로그인 인증 URL 반환",
				},
			})
			.get(
				"/kakao/callback",
				async ({ query, jwt }) =>
					await oauthController
						.preLogin(query)
						.then(async (payload) => {
							const token = await jwt.sign(payload);
							const now = new Date();
							now.setMonth(now.getMonth() + 3);

							return {
								token: token,
								// expire_at: now.toISOString(),
							};
						}),
				{
					query: t.Object({
						code: t.String(),
					}),
					response: t.Object({
						token: t.String(),
						// expire_at: t.String(),
					}),
					detail: {
						tags: ["Auth"],
						description: "카카오 로그인 콜백 URL, JWT Token 반환",
					},
				}
			)
);

export default oAuthRoutes;
