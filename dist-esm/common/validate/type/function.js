import validateType from "../type";
export default function (value, name) {
  process.env.NODE_ENV !== "production" ? validateType(value, name, typeof value === "undefined" || typeof value === "function", "Function") : void 0;
}