import validateType from "../type";
import arrayIsArray from "../../../util/array/is_array";

export default function(value, name) {
  validateType(
    value,
    name,
    typeof value === "string" || arrayIsArray(value),
    "String or Array"
  );
}
