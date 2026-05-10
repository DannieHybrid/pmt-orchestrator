import { Worker } from "bullmq";
import { prisma } from "../lib/prisma.js";

console.log("🔥 PAYMENT WORKER STARTED");

const connection = {
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null,
};

export const paymentWorker = new Worker(
  "payments",
  async (job) => {
    console.log("📦 Processing job:", job.data);

    const { paymentId } = job.data;

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) return;

    await prisma.payment.update({
      where: { id: paymentId },
      data: { status: "PROCESSING" },
    });

    await new Promise((res) => setTimeout(res, 2000));

    const success = Math.random() > 0.2;

    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: success ? "SUCCESS" : "FAILED",
      },
    });

    console.log("✅ Completed:", paymentId, success ? "SUCCESS" : "FAILED");
  },
  { connection }
);
