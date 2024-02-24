import db from "../db";
import { ProfileModel } from "../models";
import { regions } from "../regions";

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
		console.log("🚀 ~ ProfileService ~ validateRegion ~ region:", region);
		const sido: string = region.split(" ")[0];
		console.log("🚀 ~ ProfileService ~ validateRegion ~ sido:", sido);
		const sigun: string = region.split(" ")[1];
		console.log("🚀 ~ ProfileService ~ validateRegion ~ sigun:", sigun);

		if (region.split(" ").length === 2)
			if (Object.keys(regions).includes(sido))
				if (regions[sido as keyof typeof regions].includes(sigun))
					return true;

		return false;
	}
}
