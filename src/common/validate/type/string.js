import validateType from "../type";

export default function(value, name) {
  validateType(value, name, typeof value === "string", "a string");
}
