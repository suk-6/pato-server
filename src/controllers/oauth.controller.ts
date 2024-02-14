import { AuthService } from "../services/auth.service";
import { oAuthService } from "../services/oauth.service";
import { QueryModel, KakaoUserModel } from "../models";

const authService = new AuthService();
const oauthService = new oAuthService();

export class oAuthController {
	async preLogin(query: QueryModel) {
		const code = query.code;
		if (!code) throw new Error("Invalid code");

		const user = await oauthService.getKakaoUser(code);
		let uuid = await authService.getUuid(user.id);

		if (!uuid) uuid = await this.register(user);
		if (uuid) return this.login(uuid);

		throw new Error("Failed to login");
	}

	async register(user: KakaoUserModel) {
		return await authService.register(user);
	}

	async login(uuid: string) {
		const payload = {
			uuid: uuid,
		};

		return payload;
	}

	async getKakaoAuth() {
		return `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.KAKAO_CLIENT_ID}&redirect_uri=${process.env.KAKAO_REDIRECT_URI}&response_type=code`;
	}
}
