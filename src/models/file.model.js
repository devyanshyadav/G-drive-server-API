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
  fileSize: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    required: true,
  },
  parentFolder: {
    type: Schema.Types.ObjectId,
    ref: "Folder",
    required: true,
  },
});
const File = mongoose.model("File", fileSchema);

export default File;
