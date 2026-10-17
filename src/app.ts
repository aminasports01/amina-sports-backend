import express, { Application, Request, Response } from "express";
import { globalErrorHandler } from "./app/middleware/golbelErrorHandler";
import { notFound } from "./app/middleware/notFound";
import cors from "cors";
import router from "./app/routes";
import { handleWebhook } from "./app/modules/payment/payment.webhook";

const app: Application = express();

// Allowed origins (Ensure all have the full https:// protocol)
const allowedOrigins = [
  "http://localhost:3000",
  // "https://www.seraplace.com",
  // "https://seraplace.com",
  "https://amina-sports-frontend.vercel.app",
];

const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) => {
    // Allow requests with no origin (like mobile apps, curl, Postman, or server-to-server)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Origin",
    "X-Requested-With",
    "Accept",
  ],
  optionsSuccessStatus: 204,
};

// FIRST: CORS (this handles OPTIONS preflight automatically in Express 5)
app.use(cors(corsOptions));

// Middleware
app.use(express.urlencoded({ extended: true }));

// Stripe webhook needs the raw body, so we use express.raw for that specific route
app.post("/webhook", express.raw({ type: "application/json" }), handleWebhook);

app.use(express.json());

app.use("/api/v1", router);

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Server is running",
  });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
