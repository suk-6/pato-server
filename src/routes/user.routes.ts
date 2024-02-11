import { Elysia, t } from "elysia";
import db from "../db";
import logger from "../controllers/auth.controllers";

const userRoutes = new Elysia({ name: "User Routes" }).group("/users", (app) =>
	app
		.get("/", () => "User Routes")
		.post("/signup", async ({ body }) => logger(body), {
			body: t.Object({
				username: t.String(),
				password: t.String(),
				name: t.String(),
				email: t.String(),
				phone: t.String(),
			}),
		})
);

export default userRoutes;
