import { connectDatabase } from "./config/database.js";
import { app } from "./app.js";

const PORT = Number(process.env.PORT) || 5000;

const startServer = async () => {
  await connectDatabase(process.env.MONGODB_URI);

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
