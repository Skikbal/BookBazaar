import { Schema, model } from "mongoose";

const apiKeySchema = new Schema({
  apikey: {
    type: String,
    required: true,
    unique: true,
  },
  apiKeyExpiry: {
    type: Date,
    required: true,
  },
  generatedBy: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  lastUsedAt: {
    type: Date,
  },
}, { timestamps: true });

export const ApiKey = model("ApiKeys", apiKeySchema);
