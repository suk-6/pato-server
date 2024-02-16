import { MatchingService } from "../services/matching.service";

const matchingService = new MatchingService();

export class MatchingController {
	async startMatching(uuid: string) {
		return await matchingService.startMatching(uuid);
	}
}
