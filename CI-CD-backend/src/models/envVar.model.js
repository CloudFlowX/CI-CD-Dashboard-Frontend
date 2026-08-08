import mongoose from "mongoose";
import { encrypt, decrypt } from "../utils/encryption.js";

const envVarSchema = new mongoose.Schema(
  {
    environment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Environment",
      required: true,
    },
    key: {
      type: String,
      required: true,
      trim: true,
    },
    value: {
      type: String,
      required: true,
    },
    scope: {
      type: String,
      default: "Local",
    },
    masked: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt value before saving if it is masked
envVarSchema.pre("save", function (next) {
  if (this.isModified("value") && this.masked && this.value) {
    this.value = encrypt(this.value);
  }
  next();
});

// Decrypt value when finding
envVarSchema.post(["find", "findOne"], function (docs) {
  if (!docs) return;
  const decryptDoc = (doc) => {
    if (doc.masked && doc.value) {
      doc.value = decrypt(doc.value);
    }
  };
  
  if (Array.isArray(docs)) {
    docs.forEach(decryptDoc);
  } else {
    decryptDoc(docs);
  }
});

export default mongoose.model("EnvVar", envVarSchema);
