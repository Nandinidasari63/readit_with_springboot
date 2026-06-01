import { ObjectId } from "mongodb";
import { usersCollection } from "../db/client.ts";

export class AuthService {
  // Simple password hashing using Web Crypto API
  async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  // Compare password with hash
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    const passwordHash = await this.hashPassword(password);
    return passwordHash === hash;
  }

  // Create a new user (signup)
  async createUser(username: string, password: string) {
    // Check if user already exists
    const existingUser = await usersCollection.findOne({
      name: username,
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const passwordHash = await this.hashPassword(password);

    const result = await usersCollection.insertOne({
      name: username,
      passwordHash,
      createdAt: new Date(),
    });

    return {
      _id: result.insertedId.toString(),
      name: username,
    };
  }

  // Authenticate user (login)
  async authenticateUser(username: string, password: string) {
    const user = await usersCollection.findOne({
      name: username,
    });

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await this.verifyPassword(
      password,
      user.passwordHash || "",
    );

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    return {
      _id: user._id.toString(),
      name: user.name,
    };
  }
}
