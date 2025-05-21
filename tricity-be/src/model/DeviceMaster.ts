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
    section: { type: String, required: true, index: true },
    deviceType: { type: String, required: true, index: true },
    brand: { type: String, required: true, index: true },
    deviceModel: { type: String, required: true, index: true },
    leadAccessories: { type: String, required: true, index: true },
    mriCompatible: { type: Boolean, required: true, index: true },
    mriCondition: { type: String, required: true },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add virtual ID field
DeviceMasterSchema.virtual("id").get(function (this: IDeviceMaster) {
  // @ts-ignore
  return this._id.toHexString();
});

// Add compound unique index
DeviceMasterSchema.index(
  {
    section: 1,
    deviceType: 1,
    brand: 1,
    deviceModel: 1,
    leadAccessories: 1,
    mriCompatible: 1,
    organizationId: 1,
  },
  {
    unique: true,
    name: "unique_device_master_per_org",
  }
);

export default mongoose.model<IDeviceMaster>(
  "DeviceMaster",
  DeviceMasterSchema
);
