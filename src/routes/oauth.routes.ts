import { Elysia, t } from "elysia";
import jwt from "@elysiajs/jwt";
import { oAuthController } from "../controllers/oauth.controller";

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
			// .get("/kakao/get", () => oauthController.getKakaoAuth(), {
			// 	response: t.String(),
			// 	detail: {
			// 		tags: ["Auth"],
			// 		description: "카카오 로그인 인증 URL 반환",
			// 	},
			// })
			.get(
				"/kakao/login",
				async ({ query, jwt }) =>
					await oauthController
						.preLogin(query)
						.then(async (payload) => {
							const token = await jwt.sign(payload);
							const now = new Date();
							now.setMonth(now.getMonth() + 3);

							return {
								token: token,
								now: now.toISOString(),
								// expire_at: now.toISOString(),
							};
						}),
				{
					query: t.Object({
						code: t.String(),
					}),
					response: t.Object({
						token: t.String(),
						now: t.String(),
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
