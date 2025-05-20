import mongoose from "mongoose";
import { randomUUID } from "crypto";
import SignupKey from "../model/Signupkey";

const numKeys = parseInt(process.argv[2], 10) || 1;

mongoose
  .connect(process.env.MONGODB_URI || "")
  .then(async () => {
    const keys = [];
    for (let i = 0; i < numKeys; i++) {
      const key = randomUUID();
      const newKey = new SignupKey({ key, role: "SUPERUSER" });
      await newKey.save();
      keys.push(key);
      console.log(`Signup Key #${i + 1} for Superuser:`, key);
    }
    console.log("\nAll generated keys:", keys);
    process.exit(0);
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
