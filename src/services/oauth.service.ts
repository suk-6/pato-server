import { KakaoTokenModel } from "../models";

export class oAuthService {
	async getKakaoUser(code: string) {
		const token = await this.getKakaoToken(code);
		const user = await this.getKakaoUserInfo(token);
		console.log("🚀 ~ oAuthService ~ getKakaoUser ~ user:", user);

		return user;
	}

	async getKakaoToken(code: string) {
		const token = await fetch(process.env.KAKAO_TOKEN_URL as string, {
			method: "POST",
			headers: {
				"Content-Type":
					"application/x-www-form-urlencoded;charset=utf-8",
			},
			body: new URLSearchParams({
				code: code,
				grant_type: "authorization_code",
				client_id: process.env.KAKAO_CLIENT_ID as string,
				redirect_uri: process.env.KAKAO_REDIRECT_URI as string,
				client_secret: process.env.KAKAO_CLIENT_SECRET as string,
			}),
		}).then((res) => res.json());

		return token as KakaoTokenModel;
	}

	async getKakaoUserInfo(token: KakaoTokenModel) {
		const user = await fetch(process.env.KAKAO_USERINFO_URL as string, {
			headers: {
				Authorization: `Bearer ${token.access_token}`,
			},
		}).then((res) => res.json());

		return user;
	}
}
