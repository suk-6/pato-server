import db from "../db";
import RegisterUser from "../db/schema";

export class AuthService {
	async register(user: Object) {
		const registerUser = user as RegisterUser;

		registerUser.password = await Bun.password.hash(registerUser.password);

		registerUser.premiere_user = false;
		registerUser.admin = false;

		// Checking if the user already exists (username, email, phone)
		const existsUser = await db.user.findFirst({
			where: {
				OR: [
					{ username: registerUser.username },
					{ email: registerUser.email },
					{ phone: registerUser.phone },
				],
			},
		});

		if (existsUser) {
			return false;
		} else {
			await db.user.create({ data: registerUser }).then((user) => {
				console.log(user);
			});

			return true;
		}
	}
}
