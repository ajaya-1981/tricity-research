import mongoose, { Schema, Document } from "mongoose";

export interface IDeviceMaster extends Document {
  section: string;
  deviceType: string;
  brand: string;
  deviceModel: string;
  leadAccessories: string;
  mriCompatible: boolean;
  mriCondition: string;
  organizationId: mongoose.Types.ObjectId;
  id: string;
}

const DeviceMasterSchema: Schema<IDeviceMaster> = new Schema(
  {
    section: { type: String, required: true },
    deviceType: { type: String, required: true },
    brand: { type: String, required: true },
    deviceModel: { type: String, required: true },
    leadAccessories: { type: String, required: true },
    mriCompatible: { type: Boolean, required: true },
    mriCondition: { type: String, required: true },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

DeviceMasterSchema.virtual("id").get(function (this: IDeviceMaster) {
  //@ts-ignore
  return this._id.toHexString();
});

export default mongoose.model<IDeviceMaster>(
  "DeviceMaster",
  DeviceMasterSchema
);
