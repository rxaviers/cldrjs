import validateType from "../type";
import isPlainObject from "../../../util/is_plain_object";

export default function(value, name) {
  validateType(
    value,
    name,
    typeof value === "undefined" || isPlainObject(value),
    "Plain Object"
  );
}
