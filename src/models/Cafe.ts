import { Schema, model, Types } from "mongoose";

export interface ICafe {
  _id: Types.ObjectId;
  name: string;
  location?: string;
  createdBy: Types.ObjectId;
  managedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const cafeSchema = new Schema<ICafe>(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, trim: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    managedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export const Cafe = model<ICafe>("Cafe", cafeSchema);
