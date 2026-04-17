import { connectDatabase } from "./config/database.js";
import { app } from "./app.js";

const port = Number(process.env.PORT) || 5000;

const startServer = async () => {
  await connectDatabase(process.env.MONGODB_URI);

  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
