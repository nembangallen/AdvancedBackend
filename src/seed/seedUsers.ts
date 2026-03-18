import "dotenv/config";
import bcrypt from "bcrypt";
import { connectDB } from "../config/db";
import { User } from "../models/User";
import { ROLES } from "../constants/roles";

const BCRYPT_ROUNDS = 12;

async function seedUsers() {
  try {
    await connectDB();

    const usersToSeed = [
      {
        email: "superadmin@gmail.com",
        password: "Password123",
        role: ROLES.SUPERADMIN,
      },
      {
        email: "admin@gmail.com",
        password: "Password123",
        role: ROLES.ADMIN,
      },
      {
        email: "user@gmail.com",
        password: "Password123",
        role: ROLES.USER,
      },
    ];

    for (const item of usersToSeed) {
      const existingUser = await User.findOne({ email: item.email });

      if (existingUser) {
        console.log(`User already exists: ${item.email}`);
        continue;
      }

      const passwordHash = await bcrypt.hash(item.password, BCRYPT_ROUNDS);

      await User.create({
        email: item.email,
        passwordHash,
        role: item.role,
        emailVerified: true,
      });

      console.log(`Seeded ${item.role}: ${item.email}`);
    }

    console.log("✅ User seeding completed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

seedUsers();
