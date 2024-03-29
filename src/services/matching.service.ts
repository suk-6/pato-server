import { redis } from "../redis";
import { base64encode } from "../base64";
import { ProfileController } from "../controllers/profile.controller";
import { ChatController } from "../controllers/chat.controller";
import { AuthController } from "../controllers/auth.controller";

const profileController = new ProfileController();
const chatController = new ChatController();
const authController = new AuthController();

export class MatchingService {
	async startMatching(uuid: string) {
		const profile = await profileController.getProfile(uuid, false);
		if (profile === null) throw new Error("Profile not found");

		let region = profile.region;
		if (region === undefined) throw new Error("Region is not provided");
		region = base64encode(region);

		if (!(await redis.exists(`waitingRegion:${region}`))) {
			const result = await this.appendUser(region, uuid);

			authController
				.adminCheck(uuid)
				.then((isAdmin) =>
					isAdmin ? console.log(profile, result) : null
				);

			return {
				status: "waiting",
			};
		} else {
			if (await this.existUser(region, uuid))
				throw new Error("User already exists");

			const matchedUuid = await this.popUser(region);
			if (matchedUuid === null) throw new Error("Matching error");

			await this.endMatching(uuid, matchedUuid);

			return { status: "matched" };
		}
	}

	async endMatching(uuid: string, matchedUuid: string) {
		await chatController.createChat(uuid, matchedUuid);
		this.endWaiting(matchedUuid);
	}

	async existUser(region: string, uuid: string) {
		const key = `waitingRegion:${region}`;
		const users = await redis.lrange(key, 0, -1);
		if (users.includes(uuid)) return true;
		else return false;
	}

	async appendUser(region: string, uuid: string, isFront: boolean = false) {
		const key = `waitingRegion:${region}`;
		if (isFront) return redis.lpush(key, uuid);
		else return redis.rpush(key, uuid);
	}

	async popUser(region: string) {
		const key = `waitingRegion:${region}`;
		return await redis.lpop(key);
	}

	async waitingSocket(uuid: string) {
		const key = `isMatched:${uuid}`;
		while (true) {
			if (await redis.exists(key)) break;
			await new Promise((r) => setTimeout(r, 2000));
		}
		redis.del(key);

		return { status: true };
	}

	async endWaiting(uuid: string) {
		const key = `isMatched:${uuid}`;
		redis.set(key, 1);
	}

	async cancelMatching(uuid: string) {
		const profile = await profileController.getProfile(uuid, false);
		if (profile === null)
			return { status: false, message: "Profile not found" };

		let region = profile.region;
		if (region === undefined)
			return { status: false, message: "Region is not provided" };
		region = base64encode(region);

		return await this.removeUser(region, uuid);
	}

	async removeUser(region: string, uuid: string) {
		const key = `waitingRegion:${region}`;
		await redis.lrem(key, 0, uuid);

		return { status: true };
	}
}
