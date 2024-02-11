import { Elysia, t } from "elysia";
import { AuthController } from "../controllers/auth.controller";

const authController = new AuthController();

const userRoutes = new Elysia({ name: "User Routes" }).group("/users", (app) =>
	app
		.get("/", () => "User Routes", {
			response: t.String(),
		})
		.post("/signup", async ({ body }) => authController.register(body), {
			body: t.Object({
				username: t.String(),
				password: t.String(),
				name: t.String(),
				email: t.String(),
				phone: t.String(),
			}),
			response: t.Object({
				status: t.String(),
				message: t.String(),
			}),
		})
);

export default userRoutes;
