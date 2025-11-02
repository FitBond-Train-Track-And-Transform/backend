import { Router } from "express";
import { prisma } from "../config/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();

const signToken = (id: number) => {
  const secret = process.env.JWT_SECRET || "secret";
  return jwt.sign({ id }, secret, { expiresIn: "7d" });
};

router.post("/signup", async (req, res) => {
  try {
    const { name, age, gender, specialization, email, password, confirmPassword } = req.body;
    if (!name || !age || !gender || !specialization || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: "Missing fields" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const existing = await prisma.trainer.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: "Email already in use" });

    const hashed = await bcrypt.hash(password, 10);
    const trainer = await prisma.trainer.create({
      data: {
        name,
        age: Number(age),
        gender,
        specialization,
        email,
        password: hashed
      },
      select: {
        id: true,
        name: true,
        email: true,
        age: true,
        gender: true,
        specialization: true,
        createdAt: true
      }
    });

    const token = signToken(trainer.id);
    res.status(201).json({ trainer, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Missing fields" });

    const trainer = await prisma.trainer.findUnique({ where: { email } });
    if (!trainer) return res.status(400).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, trainer.password);
    if (!ok) return res.status(400).json({ error: "Invalid credentials" });

    const token = signToken(trainer.id);
    const safe = { id: trainer.id, name: trainer.name, email: trainer.email, age: trainer.age, gender: trainer.gender, specialization: trainer.specialization, createdAt: trainer.createdAt };

    res.json({ trainer: safe, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
