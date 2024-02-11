import { Elysia, t } from "elysia";
import { AuthService } from "../services/auth.service";

const authService = new AuthService();

const userRoutes = new Elysia({ name: "User Routes" }).group("/users", (app) =>
	app
		.get("/", () => "User Routes")
		.post("/signup", async ({ body }) => authService.register(body), {
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
