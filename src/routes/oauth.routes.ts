import { Elysia, t } from "elysia";
import { oAuthController } from "../controllers/oauth.controller";

const oauthController = new oAuthController();

const oAuthRoutes = new Elysia({ name: "oAuth Routes" }).group(
	"/oauth",
	(app) =>
		app
			.get("/", () => "oAuth Routes", {
				response: t.String(),
			})
			.get(
				"/kakao/callback",
				({ query }) => oauthController.login(query),
				{
					query: t.Object({
						code: t.String(),
					}),
				}
			)
);

export default oAuthRoutes;
