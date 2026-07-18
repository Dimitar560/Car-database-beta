import { Router } from "express";
import { CarModel } from "../models/Car.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { validate } from "../middleware/validate.js";
import { carSchema, carUpdateSchema } from "../validation/car.js";
import { asyncHandler } from "../lib/asyncHandler.js";
import { AppError } from "../lib/AppError.js";

const router = Router();

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const cars = await CarModel.find();
    res.json(cars);
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const car = await CarModel.findById(req.params.id);
    if (!car) {
      throw new AppError("NOT_FOUND", 404, "Car not found");
    }
    res.json(car);
  })
);

router.post(
  "/",
  isAuthenticated,
  validate(carSchema),
  asyncHandler(async (req, res) => {
    const car = await CarModel.create(req.body);
    res.status(201).json(car);
  })
);

router.patch(
  "/:id",
  isAuthenticated,
  validate(carUpdateSchema),
  asyncHandler(async (req, res) => {
    const car = await CarModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!car) {
      throw new AppError("NOT_FOUND", 404, "Car not found");
    }
    res.json(car);
  })
);

router.delete(
  "/:id",
  isAuthenticated,
  asyncHandler(async (req, res) => {
    const car = await CarModel.findByIdAndDelete(req.params.id);
    if (!car) {
      throw new AppError("NOT_FOUND", 404, "Car not found");
    }
    res.status(204).end();
  })
);

export default router;
