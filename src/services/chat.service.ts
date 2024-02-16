export class ChatService {
	async createChat(uuid1: string, uuid2: string) {
		const chatID = crypto.randomUUID();
		// TODO: Implement chat creation
		return chatID;
	}
}
