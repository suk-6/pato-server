import { AuthService } from "../services/auth.service";
import { oAuthController } from "./oauth.controller";
import db from "../db";

const authService = new AuthService();
const oauthController = new oAuthController();

export class AuthController {
	async getUser(uuid: string) {
		return await authService.getUser(uuid);
	}

	async testUserLogin() {
		const user = {
			uuid: crypto.randomUUID(),
			login_type: 0,
			kakaoUID: 0,
			name: "테스트1",
			email: "test@test.com",
			phone: "+82 10-0000-0000",
			gender: "male",
			birthyear: "1999",
			birthdate: "0101",
			premiere_user: true,
			admin: true,
		};

		const isExist = await db.user.findFirst({
			where: {
				login_type: user.login_type,
				name: user.name,
			},
		});

		if (isExist) {
			console.log(isExist);
			return oauthController.login(isExist.uuid);
		}

		const uuid = await db.user.create({ data: user }).then((user) => {
			console.log(user);
			return user.uuid;
		});

		if (uuid === undefined) throw new Error("Failed to register user");
		return oauthController.login(uuid);
	}

	async adminCheck(uuid: string) {
		return await authService.adminCheck(uuid);
	}
}
