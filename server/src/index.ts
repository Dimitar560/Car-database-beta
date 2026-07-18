import "dotenv/config";
import { connectDb } from "./config/db.js";
import { createApp } from "./app.js";

const PORT = process.env.PORT ?? "8000";
const MONGO_URI = process.env.MONGO_URI ?? "mongodb://localhost:27017/autoDB";
const SESSION_SECRET = process.env.SESSION_SECRET;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? "http://localhost:5173";

if (!SESSION_SECRET) {
  throw new Error("SESSION_SECRET must be set in .env");
}

async function main() {
  await connectDb(MONGO_URI);

  const app = createApp({ sessionSecret: SESSION_SECRET!, mongoUri: MONGO_URI, clientOrigin: CLIENT_ORIGIN });

  app.listen(PORT, () => {
    console.log(`Server is on ${PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
