import validate from "../validate";
export default function (value, name) {
  process.env.NODE_ENV !== "production" ? validate("E_MISSING_PARAMETER", typeof value !== "undefined", {
    name: name
  }) : void 0;
}