import express, { Application, Request, Response } from "express";
import cors from "cors";
import { globalErrorHandler } from "./app/middleware/golbelErrorHandler";
import { notFound } from "./app/middleware/notFound";
import router from "./app/routes";
import { handleWebhook } from "./app/modules/payment/payment.webhook";

const app: Application = express();

// Allowed Origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://www.aminasports.com",
  "https://aminasports.com",
  "https://amina-sports-frontend.vercel.app",
];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(
        new Error(`CORS policy error: Origin ${origin} is not allowed.`),
      );
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

// FIRST: CORS Middleware
app.use(cors(corsOptions));

// Middleware
app.use(express.urlencoded({ extended: true }));

// Stripe webhook needs the raw body
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
