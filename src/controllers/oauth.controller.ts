import { oAuthService } from "../services/oauth.service";
import { QueryModel } from "../models";

const oauthService = new oAuthService();

export class oAuthController {
	async login(query: QueryModel) {
		const code = query.code;
		console.log("🚀 ~ oAuthController ~ login ~ code:", code);
		const user = await oauthService.getKakaoUser(code);
	}
}
