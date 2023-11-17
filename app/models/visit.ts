import { env } from "process";
import {RedisClientOptions, createClient} from "redis";

export class Visit{
    static async incr(): Promise<number>{
        const host = env.REDIS_HOST || 'localhost';
        const port = env.REDIS_PORT || "6379";

        const options: RedisClientOptions = {
            url:  `redis://${host}:${port}`
        }

        const redis = createClient(options)

        redis.connect();
        let count = await redis.incr("visits")
        return count;
    }
}
