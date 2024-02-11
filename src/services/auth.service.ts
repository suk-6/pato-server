import db from "../db";

interface RegisterUser {
	username: string;
	password: string;
	name: string;
	email: string;
	phone: string;
	premiere_user: boolean;
	admin: boolean;
}

export class AuthService {
	async register(user: Object) {
		const registerUser = user as RegisterUser;

		registerUser.password = await Bun.password.hash(registerUser.password);

		registerUser.premiere_user = false;
		registerUser.admin = false;

		db.user.create({ data: registerUser }).then((user) => {
			console.log(user);
		});
	}
}
