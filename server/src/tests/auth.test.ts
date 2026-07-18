import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { createApp } from "../app.js";
import { UserModel } from "../models/User.js";

let mongod: MongoMemoryServer;
let app: ReturnType<typeof createApp>;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
  app = createApp({ sessionSecret: "test-secret", mongoUri: uri, clientOrigin: "http://localhost:5173" });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

beforeEach(async () => {
  await UserModel.deleteMany({});
});

describe("auth flow", () => {
  it("me returns 401 when logged out", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });

  it("register -> me -> logout -> me", async () => {
    const agent = request.agent(app);

    const registerRes = await agent
      .post("/api/auth/register")
      .send({ username: "alice", password: "correcthorsebattery" });
    expect(registerRes.status).toBe(201);

    const meRes = await agent.get("/api/auth/me");
    expect(meRes.status).toBe(200);
    expect(meRes.body.user.username).toBe("alice");

    const logoutRes = await agent.post("/api/auth/logout");
    expect(logoutRes.status).toBe(204);

    const meAfterLogout = await agent.get("/api/auth/me");
    expect(meAfterLogout.status).toBe(401);
  });

  it("rejects wrong password on login", async () => {
    const agent = request.agent(app);
    await agent.post("/api/auth/register").send({ username: "bob", password: "correcthorsebattery" });
    await agent.post("/api/auth/logout");

    const loginRes = await agent.post("/api/auth/login").send({ username: "bob", password: "wrongpass" });
    expect(loginRes.status).toBe(401);
  });
});
