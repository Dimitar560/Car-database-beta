import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { createApp } from "../app.js";
import { CarModel } from "../models/Car.js";
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
  await CarModel.deleteMany({});
  await UserModel.deleteMany({});
});

async function loggedInAgent() {
  const agent = request.agent(app);
  await agent.post("/api/auth/register").send({ username: "tester", password: "hunter2pass" });
  return agent;
}

const sampleCar = {
  src: "http://example.com/car.jpg",
  title: "Test Car",
  shortDesc: "A car for testing.",
  priceFrom: 10000,
  priceTo: 15000,
  fuelTypes: ["petrol"],
  bodyStyles: ["sedan"],
};

describe("GET /api/cars", () => {
  it("returns an empty list initially", async () => {
    const res = await request(app).get("/api/cars");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("404s on an unknown id", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).get(`/api/cars/${fakeId}`);
    expect(res.status).toBe(404);
  });
});

describe("write routes require authentication", () => {
  it("401s on POST without a session", async () => {
    const res = await request(app).post("/api/cars").send(sampleCar);
    expect(res.status).toBe(401);
  });

  it("401s on PATCH/DELETE without a session", async () => {
    const car = await CarModel.create(sampleCar);
    const patchRes = await request(app).patch(`/api/cars/${car._id}`).send({ title: "x" });
    const deleteRes = await request(app).delete(`/api/cars/${car._id}`);
    expect(patchRes.status).toBe(401);
    expect(deleteRes.status).toBe(401);
  });
});

describe("authenticated car CRUD", () => {
  it("creates, updates and deletes a car", async () => {
    const agent = await loggedInAgent();

    const createRes = await agent.post("/api/cars").send(sampleCar);
    expect(createRes.status).toBe(201);
    const id = createRes.body._id;

    const patchRes = await agent.patch(`/api/cars/${id}`).send({ title: "Updated Car" });
    expect(patchRes.status).toBe(200);
    expect(patchRes.body.title).toBe("Updated Car");

    const deleteRes = await agent.delete(`/api/cars/${id}`);
    expect(deleteRes.status).toBe(204);

    const getRes = await request(app).get(`/api/cars/${id}`);
    expect(getRes.status).toBe(404);
  });

  it("rejects an invalid car body with 400", async () => {
    const agent = await loggedInAgent();
    const res = await agent.post("/api/cars").send({ title: "missing fields" });
    expect(res.status).toBe(400);
  });
});
