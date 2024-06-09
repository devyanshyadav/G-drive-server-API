import mongoose from "mongoose";

const connectDB = async () => {
  const DB_NAME = process.env.DB_NAME;
  const MONGO_URI = process.env.MONGO_URI;
  try {
    const connectionInstance = await mongoose.connect(
      `${MONGO_URI}/${DB_NAME}`
    );
    console.log(
      `Mongo DB is connected at: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MONGO DB Error", error);
    process.exit(1);
  }
};

export default connectDB;
