import "dotenv/config";
import mongoose from "mongoose";
import { CarModel } from "../src/models/Car.js";

const MONGO_URI = process.env.MONGO_URI ?? "mongodb://localhost:27017/autoDB";

const sampleCars = [
  {
    src: "https://assets-eu-01.kc-usercontent.com/bb5aba31-d98c-0160-8548-418b3723c58e/38019351-1453-44f2-a696-88f5326eaade/Mercedes%20GLE%20Coupe%20(10).jpg",
    title: "Mercedes GLE Coupe",
    shortDesc: "A sporty take on the GLE with a coupe-like roofline and strong performance.",
    priceFrom: 65000,
    priceTo: 95000,
    fuelTypes: ["petrol", "diesel"],
    bodyStyles: ["suv", "coupe"],
  },
  {
    src: "https://www.topgear.com/sites/default/files/cars-car/image/2021/02/cx-5-skyactiv-g-awd-gt-sport-auto-action-3.jpg",
    title: "Mazda CX-5",
    shortDesc: "A well-rounded compact SUV known for its driving dynamics and interior quality.",
    priceFrom: 28000,
    priceTo: 38000,
    fuelTypes: ["petrol"],
    bodyStyles: ["suv"],
  },
  {
    src: "http://www.raliulsibiului.ro/wpn/wp-content/uploads/2018/07/subaru.jpg",
    title: "Subaru Impreza",
    shortDesc: "A rally-bred compact sedan/hatchback with standard all-wheel drive.",
    priceFrom: 22000,
    priceTo: 30000,
    fuelTypes: ["petrol"],
    bodyStyles: ["sedan", "hatchback"],
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/6/68/2018_Tesla_Model_3.jpg",
    title: "Tesla Model 3",
    shortDesc: "An all-electric sedan with strong range and instant torque.",
    priceFrom: 39000,
    priceTo: 55000,
    fuelTypes: ["electric"],
    bodyStyles: ["sedan"],
  },
];

async function main() {
  await mongoose.connect(MONGO_URI);
  const count = await CarModel.countDocuments();
  if (count > 0) {
    console.log(`cars collection already has ${count} documents — skipping seed.`);
  } else {
    await CarModel.insertMany(sampleCars);
    console.log(`Inserted ${sampleCars.length} sample cars.`);
  }
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
