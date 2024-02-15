import { Elysia, t } from "elysia";
import jwt from "@elysiajs/jwt";
import { AuthController } from "../controllers/auth.controller";
import { ProfileController } from "../controllers/profile.controller";
import { JWTPayloadModel, ProfileModel } from "../models";

const profileController = new ProfileController();
const authController = new AuthController();

const profileRoutes = new Elysia({ name: "Profile Routes" }).group(
	"/profile",
	(app) =>
		app
			.use(
				jwt({
					name: "jwt",
					secret: process.env.JWT_SECRET as string,
				})
			)
			.get(
				"/get",
				async ({ headers, jwt }) => {
					const token = headers["authorization"]?.split(" ")[1];
					if (token === undefined)
						throw new Error("Token is not provided");

					const payload = await jwt.verify(token);
					const uuid = (payload as unknown as JWTPayloadModel).uuid;
					if (uuid === undefined)
						throw new Error("UUID is not provided");

					return profileController.getProfile(uuid);
				},
				{
					headers: t.Object({
						authorization: t.String(),
					}),
					response: t.Object({
						uuid: t.String(),
						image: t.String(),
						nickname: t.String(),
						region: t.String(),
						alcohol: t.Number(),
						hobby: t.String(),
					}),
					detail: {
						tags: ["Profile"],
						description: "프로필 조회",
					},
				}
			)
			.post(
				"/save",
				async ({ headers, body, jwt }) => {
					if (30000000 < body.image.length)
						throw new Error("File size is too big");

					const token = headers["authorization"]?.split(" ")[1];
					if (token === undefined)
						throw new Error("Token is not provided");

					const payload = await jwt.verify(token);
					const uuid = (payload as unknown as JWTPayloadModel).uuid;
					if (uuid === undefined)
						throw new Error("UUID is not provided");
					authController.getUser(uuid); // 유저 검증

					const profile = body as ProfileModel;
					profile.uuid = uuid;

					return profileController.saveProfile(profile);
				},
				{
					headers: t.Object({
						authorization: t.String(),
					}),
					body: t.Object({
						image: t.String(),
						nickname: t.String(),
						region: t.String(),
						alcohol: t.Number(),
						hobby: t.String(),
					}),
					response: t.Boolean(),
					detail: {
						tags: ["Profile"],
						description: "프로필 저장",
					},
				}
			)
);

export default profileRoutes;
