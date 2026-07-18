import { describe, it, expect } from "vitest";
import { convertLegacyCar } from "../../scripts/migrate.js";

describe("convertLegacyCar", () => {
  it("converts legacy boolean-ish fields into arrays", () => {
    const legacy = {
      petrol: "true",
      diesel: false,
      electric: "false",
      sedan: true,
      coupe: "true",
      suv: undefined,
      priceFrom: "10000",
      priceTo: "20000",
    };

    const result = convertLegacyCar(legacy);

    expect(result.fuelTypes).toEqual(["petrol"]);
    expect(result.bodyStyles).toEqual(["sedan", "coupe"]);
    expect(result.priceFrom).toBe(10000);
    expect(result.priceTo).toBe(20000);
  });

  it("defaults missing prices to 0", () => {
    const result = convertLegacyCar({});
    expect(result.priceFrom).toBe(0);
    expect(result.priceTo).toBe(0);
    expect(result.fuelTypes).toEqual([]);
    expect(result.bodyStyles).toEqual([]);
  });
});
