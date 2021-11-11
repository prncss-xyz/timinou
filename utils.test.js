import { format, parseUnit, parseValue } from "./utils.js";

test("format", () => {
  expect(format(22)).toBe("22");
  expect(format(5)).toBe("5");
  expect(format(63)).toBe("1:03");
});

test("parseUnit", () => {
  expect(parseUnit("3")).toBe(1000);
  expect(parseUnit("3s")).toBe(1000);
  expect(parseUnit("3m")).toBe(60000);
});

test("parseValue", () => {
  expect(parseValue("3")).toBe(3);
  expect(parseValue("3s")).toBe(3);
  expect(parseValue("3m")).toBe(3);
});
