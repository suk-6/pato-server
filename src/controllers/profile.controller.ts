import { ProfileModel } from "../models";
import { ImageService } from "../services/image.service";
import { ProfileService } from "../services/profile.service";

const imageService = new ImageService();
const profileService = new ProfileService();

export class ProfileController {
	async saveProfile(profile: ProfileModel) {
		if (!(await this.validateRegion(profile.region)))
			throw new Error("Invalid region");
		if (await profileService.saveProfile(profile))
			return {
				status: true,
			};
		return {
			status: false,
		};
	}

	async validateRegion(region: string) {
		if (region === undefined) throw new Error("Region is not provided");
		return profileService.validateRegion(region);
	}

	async getProfile(uuid: string, filtered: boolean = true) {
		const profile = await profileService.getUserProfile(uuid);
		if (profile === null) throw new Error("Profile not found");

		let image;
		if (profile.image === null) image = undefined;
		else image = profile.image;

		const result: ProfileModel = {
			uuid: filtered ? "rejected" : profile.uuid,
			image: image,
			nickname: profile.nickname,
			region: profile.region,
			alcohol: parseFloat(profile.alcohol.toString()),
			hobby: profile.hobby,
		};

		return result;
	}

	async checkNickname(nickname: string) {
		return { status: await profileService.checkNickname(nickname) };
	}

	async saveImage(uuid: string, image: string) {
		const imageUrl = await imageService.uploadImage(image);
		if (imageUrl === null) throw new Error("Image upload failed");

		if (await profileService.updateImage(uuid, imageUrl))
			return {
				status: true,
			};

		return {
			status: false,
		};
	}
}
