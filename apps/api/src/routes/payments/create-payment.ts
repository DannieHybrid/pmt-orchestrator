import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";
import { paymentQueue } from "../../queues/payment.queue.js";

const schema = z.object({
  amount: z.number().int().positive(),
  currency: z.string(),
  provider: z.enum(["stripe", "paystack", "flutterwave"]),
  idempotencyKey: z.string(),
});

export async function createPaymentRoute(app: FastifyInstance) {
  app.post("/payments", async (req, reply) => {
    const data = schema.parse(req.body);

    // 1. idempotency check
    const existing = await prisma.payment.findUnique({
      where: { idempotencyKey: data.idempotencyKey },
    });

    if (existing) {
      return reply.send(existing);
    }

    // 2. create payment (PENDING)
    const payment = await prisma.payment.create({
      data: {
        amount: data.amount,
        currency: data.currency,
        provider: data.provider,
        idempotencyKey: data.idempotencyKey,
        status: "PENDING",
      },
    });

    // 3. 🚀 QUEUE JOB (THIS IS THE IMPORTANT PART)
    await paymentQueue.add("process-payment", {
      paymentId: payment.id,
    });

    return reply.code(201).send(payment);
  });
}
