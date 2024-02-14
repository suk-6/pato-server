import { AuthController } from "./auth.controller";
import { ProfileModel } from "../models";
import { ImageService } from "../services/image.service";
import { ProfileService } from "../services/profile.service";

const authController = new AuthController();
const imageService = new ImageService();
const profileService = new ProfileService();

export class ProfileController {
	async saveProfile(profile: ProfileModel) {
		const imageUrl = await imageService.uploadImage(profile.image);
		profile.image = imageUrl;

		if (await profileService.saveProfile(profile)) return true;
		return false;
	}

	async getProfile(uuid: string) {
		const profile = await profileService.getUserProfile(uuid);
		if (profile === null) throw new Error("Profile not found");

		const result: ProfileModel = {
			uuid: "rejected",
			image: profile.image,
			nickname: profile.nickname,
			region: profile.region,
			alcohol: parseFloat(profile.alcohol.toString()),
			hobby: profile.hobby,
		};

		return result;
	}
}
