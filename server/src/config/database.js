import mongoose from "mongoose";

const connectDatabase = async (connectionString) => {
  if (!connectionString) {
    throw new Error("MONGODB_URI is not defined in the environment.");
  }

  await mongoose.connect(connectionString);
  console.log("MongoDB connected successfully.");
};

export { connectDatabase };
