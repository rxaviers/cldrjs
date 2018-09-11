import validateType from "../type";

export default function(value, name) {
  validateType(
    value,
    name,
    typeof value === "undefined" || typeof value === "function",
    "Function"
  );
}
