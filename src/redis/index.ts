import { get } from "http";
import { Redis } from "ioredis";

export let redis: Redis;

(async () => {
	redis = new Redis({
		host: process.env.REDIS_HOST,
		port: parseInt(process.env.REDIS_PORT as string),
		commandTimeout: parseInt(process.env.REDIS_TIMEOUT as string),
	});
	redis.on("error", (error) => {
		console.error(error);
	});
})();
