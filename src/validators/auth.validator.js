import { z } from "zod";

const registerSchema = z.object({
  userName: z
    .string({ required_error: "Username is required" })
    .trim()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(20, { message: "Username must be at most 20 characters long" }),

  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email" })
    .trim()
    .min(3, { message: "Email must be at least 3 characters long" })
    .max(20, { message: "Email must be at most 20 characters long" }),

  password: z
    .string({ required_error: "Password is required" })
    .trim()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(20, { message: "Password must be at most 20 characters long" }),
});

export default registerSchema;
