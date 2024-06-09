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
  parentFolder: {
    type: Schema.Types.ObjectId,
    ref: "Folder",
    required: true,
  },
});
const File = mongoose.model("File", fileSchema);

export default File;
