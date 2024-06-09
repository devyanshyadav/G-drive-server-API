import mongoose, { Schema } from "mongoose";

// Helper function to set the reference dynamically
function getSharedItemRef() {
  return this.sharedType === "file" ? "File" : "Folder";
}

const shareSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sharedEmails: [{ type: Schema.Types.ObjectId, ref: "User" }],
    sharedType: {
      type: String,
      required: true,
      enum: ["file", "folder"], // This ensures sharedType is either 'File' or 'Folder'
    },
    sharedItems: [
      {
        type: Schema.Types.ObjectId,
        refPath: "sharedItemRef", // refPath is used for dynamic reference
      },
    ],
  },
  { timestamps: true }
);

// Virtual field to set the reference path dynamically
shareSchema.virtual("sharedItemRef").get(getSharedItemRef);

const Share = mongoose.model("Share", shareSchema);

export default Share;
