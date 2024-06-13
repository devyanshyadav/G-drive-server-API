import mongoose, { Schema } from "mongoose";

const folderSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    parentFolder: {
      type: Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
    },
    folderName: {
      type: String,
      required: true,
      unique: true,
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

    // subFolders: [{ type: Schema.Types.ObjectId, ref: "Folder" }], 
    // subFolders are populated during accessing all folders in get request
  },
  { timestamps: true }
);

const Folder = mongoose.model("Folder", folderSchema);

export default Folder;
