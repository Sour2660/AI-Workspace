import app from "./app";
import { connectDB } from "./config/database";
import { env } from "./config/env";

const startServer = async () => {
  await connectDB();

  app.listen(env.PORT, () => {
    console.log(`
==========================================
🚀 FlowDesk Backend Started
🌍 Environment : ${env.NODE_ENV}
📡 Port        : ${env.PORT}
==========================================
`);
  });
};

startServer();