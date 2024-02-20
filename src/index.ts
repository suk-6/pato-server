import { Elysia, t } from "elysia";
import swagger from "@elysiajs/swagger";
import authRoutes from "./routes/auth.routes";
import oAuthRoutes from "./routes/oauth.routes";
import profileRoutes from "./routes/profile.routes";
import matchingRoutes from "./routes/matching.routes";
import matchingSocketRoutes from "./routes/matching.socket.routes";
import chatSocketRoutes from "./routes/chat.socket.routes";

const app = new Elysia();

app.use(swagger());
app.use(authRoutes);
app.use(oAuthRoutes);
app.use(profileRoutes);
app.use(matchingRoutes);
app.use(matchingSocketRoutes);
app.use(chatSocketRoutes);

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
