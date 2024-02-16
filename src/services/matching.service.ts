import { ProfileService } from "./profile.service";
import { redis } from "../redis";
import { base64encode } from "../base64";
import { ChatController } from "../controllers/chat.controller";

const profileService = new ProfileService();
const chatController = new ChatController();

export class MatchingService {
	async startMatching(uuid: string) {
		const profile = await profileService.getUserProfile(uuid);
		if (profile === null) throw new Error("Profile not found");

		let region = profile.region;
		if (region === undefined) throw new Error("Region is not provided");
		region = base64encode(region);

		if (!(await redis.exists(`waitingRegion:${region}`))) {
			await this.appendUser(region, uuid);

			return {
				status: "waiting",
				matchingID: await this.generateMatchingID(uuid),
			};
		} else {
			if (await this.existUser(region, uuid))
				throw new Error("User already exists");

			const matchedUuid = await this.popUser(region);
			if (matchedUuid === null) throw new Error("Matching error");

			const chatID = await this.endMatching(uuid, matchedUuid);

			return { status: "matched", chatID: chatID };
		}
	}

	async endMatching(uuid: string, matchedUuid: string) {
		const matchingID = await this.getMatchingID(matchedUuid);
		const chatID = await chatController.createChat(uuid, matchedUuid);

		this.endWaiting(matchingID, chatID);

		return chatID;
	}

	async existUser(region: string, uuid: string) {
		const key = `waitingRegion:${region}`;
		const users = await redis.lrange(key, 0, -1);
		if (users.includes(uuid)) return true;
		else return false;
	}

	async appendUser(region: string, uuid: string, isFront: boolean = false) {
		const key = `waitingRegion:${region}`;
		if (isFront) await redis.lpush(key, uuid);
		else await redis.rpush(key, uuid);
	}

	async popUser(region: string) {
		const key = `waitingRegion:${region}`;
		return await redis.lpop(key);
	}

	async generateMatchingID(uuid: string) {
		const matchingID = crypto.randomUUID();
		const key = `waitingUser:${uuid}`;
		await redis.set(key, matchingID);

		return matchingID;
	}

	async getMatchingID(uuid: string) {
		const key = `waitingUser:${uuid}`;
		const matchingID = await redis.get(key);
		if (matchingID === null) throw new Error("Matching ID not found");

		redis.del(key);
		return matchingID;
	}

	async waitingSocket(matchingID: string) {
		const key = `isMatched:${matchingID}`;
		while (true) {
			if (await redis.exists(key)) break;
			await new Promise((r) => setTimeout(r, 2000));
		}

		const chatID = await redis.get(key);
		if (chatID === null) throw new Error("Chat ID not found");
		return chatID;
	}

	async endWaiting(matchingID: string, chatID: string) {
		const key = `isMatched:${matchingID}`;
		if ((await redis.set(key, chatID)) === "OK") return true;
		else return false;
	}
}
