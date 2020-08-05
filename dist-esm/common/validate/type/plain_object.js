import validateType from "../type";
import isPlainObject from "../../../util/is_plain_object";
export default function (value, name) {
  process.env.NODE_ENV !== "production" ? validateType(value, name, typeof value === "undefined" || isPlainObject(value), "Plain Object") : void 0;
}