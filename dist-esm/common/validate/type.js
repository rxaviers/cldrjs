import validate from "../validate";
export default function (value, name, check, expected) {
  process.env.NODE_ENV !== "production" ? validate("E_INVALID_PAR_TYPE", check, {
    expected: expected,
    name: name,
    value: value
  }) : void 0;
}