import db from "../db";
import { calculateAge } from "./age.service";
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
			email: user.kakao_account.email,
			phone: user.kakao_account.phone_number,
			gender: user.kakao_account.gender,
			birthyear: user.kakao_account.birthyear,
			birthdate: user.kakao_account.birthday,
		};

		if (calculateAge(registerUser.birthyear, registerUser.birthdate) <= 14)
			throw new Error("underage");

		if (35 <= calculateAge(registerUser.birthyear, registerUser.birthdate))
			throw new Error("overage");

		const uuid = await db.user
			.create({ data: registerUser })
			.then((user) => user.uuid);

		return uuid;
	}

	async getUser(uuid: string) {
		const user = await db.user.findFirst({
			where: {
				uuid: uuid,
			},
		});

		if (user === null) throw new Error("User not found");
		return user;
	}

	async adminCheck(uuid: string) {
		const user = await this.getUser(uuid);
		if (user === null) throw new Error("User not found");
		return user.admin;
	}
}
