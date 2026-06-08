import "reflect-metadata" // to allow decorators work well (typeorm)
import env from "@/configs/env.config"
import { connectDB } from "@/infrastructure/database/connect.db"
import { app } from "./app";

const PORT = Number(process.env.PORT) || env.PORT;

async function bootstrap() {
  await connectDB(); // initialize DB

  app.listen(PORT, (err) => {
    if (err) {
        console.log(`Failed to start DB - Shutting down`)
    }
    console.log(`Server running on ${PORT}`);
  })
}






bootstrap();