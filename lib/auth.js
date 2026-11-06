import jwt from "jsonwebtoken";

export function verifyToken(token) {
  try {
    if (!token) {
      return null;
    }

    if (!process.env.JWT_SECRET) {
      throw new Error(
        "JWT_SECRET is missing in .env.local"
      );
    }

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    return decoded;
  } catch (error) {
    console.error(
      "JWT VERIFY ERROR:",
      error.message
    );

    return null;
  }
}