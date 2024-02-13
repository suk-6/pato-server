import { Elysia, t } from "elysia";
import oAuthRoutes from "./routes/oauth.routes";
import swagger from "@elysiajs/swagger";

const app = new Elysia();

app.use(swagger());
app.use(oAuthRoutes);

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
