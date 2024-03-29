import db from "../db";
import { regions } from "../regions";
import { ProfileModel } from "../models";

export class ProfileService {
	async saveProfile(profile: ProfileModel) {
		const isExist = await db.userProfile.findFirst({
			where: {
				uuid: profile.uuid,
			},
		});

		if (isExist) {
			return await db.userProfile.update({
				where: {
					pid: isExist.pid,
				},
				data: profile,
			});
		}

		return await db.userProfile.create({
			data: profile,
		});
	}

	async updateImage(uuid: string, image: string) {
		const isExist = await db.userProfile.findFirst({
			where: {
				uuid: uuid,
			},
		});

		if (isExist) {
			return await db.userProfile.update({
				where: {
					pid: isExist.pid,
				},
				data: {
					image: image,
				},
			});
		}

		return false;
	}

	async getUserProfile(uuid: string) {
		return await db.userProfile.findFirst({
			where: {
				uuid: uuid,
			},
		});
	}

	async checkNickname(nickname: string) {
		const isExist = await db.userProfile.findFirst({
			where: {
				nickname: nickname,
			},
		});

		if (isExist) return true;
		return false;
	}

	async validateRegion(region: string) {
		const sido: string = region.split(" ")[0];
		const sigun: string = region.split(" ")[1];

		if (region.split(" ").length === 2) {
			if (regions[sido].includes(sigun)) return true;
		}

		return false;
	}
}
