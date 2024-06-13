import mongoose, { Schema } from "mongoose";

const fileSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  fileName: {
    type: String,
    required: true,
    unique: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: true,
  },
  fileInfo: {
    width: Number,
    height: Number,
    size: Number,
    resource_type: String,
    format: String,
    bytes: Number,
  },
  folderId: {
    type: Schema.Types.ObjectId,
    ref: "Folder",
    required: true,
  },
  isTrashed: {
    status: {
      type: Boolean,
      default: false,
    },
    date: {
      type: Date,
    },
  },

  isStarred: {
    type: Boolean,
  },
});
const File = mongoose.model("File", fileSchema);

export default File;
