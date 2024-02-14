import { AuthService } from "../services/auth.service";

const authService = new AuthService();

export class AuthController {
	async getUser(uuid: string) {
		return await authService.getUser(uuid);
	}
}
