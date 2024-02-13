import db from "../db";
import jwt from "@elysiajs/jwt";
import { RegisterUser, KakaoUserModel } from "../models";

export class AuthService {
	async getUuid(kakaoUID: number) {
		const user = await db.user.findFirst({
			where: {
				kakaoUID: kakaoUID,
			},
		});

		if (user !== null) return user.uuid;
		else return false;
	}

	async register(user: KakaoUserModel) {
		const registerUser: RegisterUser = {
			uuid: crypto.randomUUID(),
			kakaoUID: user.id,
			name: user.kakao_account.name,
			phone: user.kakao_account.phone_number,
			gender: user.kakao_account.gender,
			birthyear: user.kakao_account.birthyear,
			birthdate: user.kakao_account.birthday,
		};

		const uuid = await db.user
			.create({ data: registerUser })
			.then((user) => user.uuid);

		return uuid;
	}

	// async login(uuid: string) {
	// 	return "test"; // TODO: Implement login with JWT
	// }
}
