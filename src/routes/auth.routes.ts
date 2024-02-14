import { Elysia, t } from "elysia";
import { AuthController } from "../controllers/auth.controller";
import jwt from "@elysiajs/jwt";

const authController = new AuthController();

const authRoutes = new Elysia({ name: "Auth Routes" }).group("/auth", (app) =>
	app
		.use(
			jwt({
				name: "jwt",
				secret: process.env.JWT_SECRET as string,
			})
		)
		.get(
			"/test/login",
			async ({ query, jwt }) => {
				if (query.code === process.env.TEST_CODE) {
					return await authController
						.testUserLogin()
						.then(async (payload) => {
							const token = await jwt.sign(payload);
							const now = new Date();

							return {
								token: token,
								now: now.toISOString(),
							};
						});
				} else throw new Error("Invalid code");
			},
			{
				query: t.Object({
					code: t.String(),
				}),
				response: t.Object({
					token: t.String(),
					now: t.String(),
				}),
				detail: {
					tags: ["Test"],
					description: "테스트 유저 등록 및 로그인",
				},
			}
		)
);

export default authRoutes;
