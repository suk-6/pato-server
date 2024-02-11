import { Elysia, t } from "elysia";
import userRoutes from "./routes/user.routes";
import swagger from "@elysiajs/swagger";

const app = new Elysia();

app.use(swagger());
app.use(userRoutes);

app.get(
	"/",
	() => {
		return "PATO API";
	},
	{ response: t.String() }
);

app.listen(3000);

console.log(
	`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
