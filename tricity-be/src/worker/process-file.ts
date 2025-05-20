import { Worker, Job } from "bullmq";
import * as xlsx from "xlsx";
import fs from "fs";
import mongoose from "mongoose";
import DeviceMaster from "../model/DeviceMaster";
import Redis from "ioredis";

const redisConnection = new Redis(process.env.REDIS_URL || "");
const BATCH_SIZE = 100;
mongoose.connect(process.env.MONGO_URI || "");

const fileWorker = new Worker(
  "file-import",
  async (job: Job) => {
    const { filePath, organizationId } = job.data;

    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows: any[] = xlsx.utils.sheet_to_json(sheet);

    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const chunk = rows.slice(i, i + BATCH_SIZE);

      const devices = chunk.map((row) => ({
        section: row.Section,
        deviceType: row.DeviceType,
        brand: row.Brand,
        deviceModel: row.Model,
        leadAccessories: row["Lead/Accessories"],
        mriCompatible:
          row.MRICompatible === true ||
          row.MRICompatible === "Yes" ||
          row.MRICompatible === "yes",
        mriCondition: row.MRICondition,
        organizationId: new mongoose.Types.ObjectId(organizationId),
      }));

      await DeviceMaster.insertMany(devices);
      console.log(`Processed ${i + devices.length} / ${rows.length}`);
    }

    fs.unlinkSync(filePath);
    console.log("File processing complete");
  },
  { connection: redisConnection }
);

fileWorker.on("failed", (job, err) => {
  console.error(`Job ${(job as any).id} failed:`, err);
});
