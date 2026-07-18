import { z } from "../lib/zod.js";

export const credentialsSchema = z
  .object({
    username: z.string().min(1).openapi({ example: "jane" }),
    password: z.string().min(6).openapi({ example: "hunter22" }),
  })
  .openapi("Credentials");

export const userResponseSchema = z
  .object({
    id: z.string(),
    username: z.string(),
  })
  .openapi("User");
