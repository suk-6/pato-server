import { AuthService } from "../services/auth.service";

const authService = new AuthService();

export class AuthController {
	async register(user: Object) {
		const isExists = await authService.register(user);

		if (isExists) {
			return { status: "Success", message: "User created successfully" };
		} else {
			return { status: "Error", message: "User already exists" };
		}
	}
}
