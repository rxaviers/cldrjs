import validateType from "../type";
export default function (value, name) {
  process.env.NODE_ENV !== "production" ? validateType(value, name, typeof value === "string", "a string") : void 0;
}