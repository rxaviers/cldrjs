import validateType from "../type";
import arrayIsArray from "../../../util/array/is_array";
export default function (value, name) {
  process.env.NODE_ENV !== "production" ? validateType(value, name, typeof value === "string" || arrayIsArray(value), "String or Array") : void 0;
}