import { Elysia, t } from "elysia";
import authRoutes from "./routes/auth.routes";
import oAuthRoutes from "./routes/oauth.routes";
import profileRoutes from "./routes/profile.routes";
import swagger from "@elysiajs/swagger";

const app = new Elysia();

app.use(swagger());
app.use(authRoutes);
app.use(oAuthRoutes);
app.use(profileRoutes);

app.get(
	"/",
	() => {
		return "PATO API";
	},
	{
		response: t.String(),
		detail: {
			tags: ["Basic"],
		},
	}
);

app.listen(3000);

console.log(
	`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
