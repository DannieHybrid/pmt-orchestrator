import Fastify from "fastify";
import { createPaymentRoute } from "./routes/payments/create-payment.js";
import "./workers/payment.worker.js";

const app = Fastify({
  logger: true,
});

app.get("/health", async () => {
  return {
    status: "ok",
  };
});

app.register(createPaymentRoute);

const start = async () => {
  try {
    await app.listen({
      port: 3000,
      host: "0.0.0.0",
    });

    console.log("API running on http://localhost:3000");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
