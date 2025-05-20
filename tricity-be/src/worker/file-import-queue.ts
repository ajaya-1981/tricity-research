import { Queue } from "bullmq";
import Redis from "ioredis";
// import { redisConnection } from './redis';

const redisClient = new Redis(process.env.REDIS_URL || "");

export const fileImportQueue = new Queue("file-import", {
  connection: redisClient,
});
