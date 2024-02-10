import { Elysia } from "elysia";
import swagger from "@elysiajs/swagger";

const app = new Elysia();

app.use(swagger());

app.get("/", () => {
	return "PATO API";
});

app.listen(3000);

console.log(
	`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
