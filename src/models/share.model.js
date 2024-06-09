import mongoose, { Schema } from "mongoose";

const shareSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sharedWithEmail: [{ type: Schema.Types.ObjectId, ref: "User" }],
    sharedItem: [{ type: Schema.Types.ObjectId, ref: "File" }],
    // sharedFolder:[{type: Schema.Types.ObjectId, ref: "Folder"}],
  },
  { timestamps: true }
);

const Share = mongoose.model("Share", shareSchema);

export default Share;
