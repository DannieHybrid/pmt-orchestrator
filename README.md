# 📦 Payment Orchestrator (Stripe-like Backend System)

A backend payment orchestration system built with Node.js, TypeScript, Fastify, Prisma, BullMQ, and Redis.

It simulates how production-grade payment systems like Stripe or Paystack handle asynchronous payment processing, retries, and state management.

---

## 🚀 Features

### Core System

- Payment initiation API
- Idempotency key handling
- Transaction state tracking (PENDING → PROCESSING → SUCCESS/FAILED)
- PostgreSQL persistence via Prisma

### Async Architecture

- Redis-backed job queue (BullMQ)
- Background worker processing
- Decoupled API and processing layer

---

## 🧠 Architecture

Client → API → DB → Queue → Worker → DB Update

---

## ⚙️ Tech Stack

- Node.js
- TypeScript
- Fastify
- Prisma
- PostgreSQL
- Redis
- BullMQ
- TurboRepo

---

## 🔄 Payment Flow

1. Client sends payment request
2. API validates request
3. Payment stored as PENDING
4. Job added to queue
5. Worker processes job
6. Status updated in DB

---

## 🧪 Example Request

curl -X POST http://localhost:3000/payments \
-H "Content-Type: application/json" \
-d '{
"amount": 1000,
"currency": "NGN",
"provider": "paystack",
"idempotencyKey": "test-key"
}'

---

## 🏁 Status

✔ Fully working payment orchestration system  
✔ Async worker pipeline  
✔ Queue-based architecture
