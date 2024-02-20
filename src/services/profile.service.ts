import db from "../db";
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
}
