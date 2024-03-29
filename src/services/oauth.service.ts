import { KakaoTokenModel, KakaoUserModel } from "../models";

export class oAuthService {
	async getKakaoUser(token: string) {
		// const token = await this.getKakaoToken(code);
		const user = await this.getKakaoUserInfo(token);

		if (user.id === undefined) throw new Error("Failed to get user info");
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

	async getKakaoUserInfo(accessToken: string) {
		const user = await fetch(process.env.KAKAO_USERINFO_URL as string, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		}).then((res) => res.json());

		return user as KakaoUserModel;
	}
}
