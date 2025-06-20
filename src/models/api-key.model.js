import { Schema, model } from "mongoose";

const apiKeySchema = new Schema({
  key: {
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
}, { timestamps: true });

export const ApiKey = model("ApiKeys", apiKeySchema);
