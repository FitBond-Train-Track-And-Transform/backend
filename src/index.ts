import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import { prisma } from "./config/prisma";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", async (req, res) => {
  try {
    await prisma.$connect();
    await prisma.$disconnect();
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: "DB connection failed" });
  }
});

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
