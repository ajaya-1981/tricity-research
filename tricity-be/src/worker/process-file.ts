import { Worker, Job } from "bullmq";
import * as xlsx from "xlsx";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import DeviceMaster from "../model/DeviceMaster";
import Redis from "ioredis";

const redisConnection = new Redis(process.env.REDIS_URL || "", {
  maxRetriesPerRequest: null,
});

const BATCH_SIZE = 100;
mongoose.connect(process.env.MONGODB_URI || "");

const parseFile = (filePath: string): any[] => {
  const workbook = xlsx.readFile(filePath, { raw: true });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  const rows = xlsx.utils.sheet_to_json<any[]>(sheet, { header: 1 });

  const headers = rows[0].map((h: string) => h.trim().toLowerCase());
  const dataRows = rows.slice(1);

  return dataRows.map((row) => {
    const obj: Record<string, any> = {};
    headers.forEach((header: string, index: number) => {
      obj[header] = row[index];
    });
    return obj;
  });
};

const fileWorker = new Worker(
  "file-import",
  async (job: Job) => {
    const { filePath, organizationId } = job.data;

    console.log(organizationId);

    const rows: any[] = parseFile(filePath);
    console.log("Parsed rows:", rows);

    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const chunk = rows.slice(i, i + BATCH_SIZE);

      const devices = chunk.map((row) => ({
        section: row["section"],
        deviceType: row["devicetype"],
        brand: row["brand"],
        deviceModel: row["devicemodel"],
        leadAccessories: row["leadaccessories"],
        mriCompatible:
          row["mricompatible"] === "true" ||
          row["mricompatible"] === "Yes" ||
          row["mricompatible"] === "yes",
        mriCondition: row["mricondition"],
        organizationId: new mongoose.Types.ObjectId(organizationId),
      }));

      // Optional: Validate presence of required fields
      const validDevices = devices.filter(
        (d) =>
          d.section &&
          d.deviceType &&
          d.brand &&
          d.deviceModel &&
          d.leadAccessories &&
          d.mriCondition
      );

      if (validDevices.length !== devices.length) {
        console.warn("Some rows were skipped due to missing required fields.");
      }

      if (validDevices.length > 0) {
        await DeviceMaster.insertMany(validDevices, { ordered: false });
        console.log(`Processed ${i + validDevices.length} / ${rows.length}`);
      }
    }

    fs.unlinkSync(filePath);
    console.log("File processing complete");
  },
  { connection: redisConnection }
);

fileWorker.on("failed", (job, err) => {
  console.error(`Job ${(job as any).id} failed:`, err);
});
