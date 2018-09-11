import validate from "../validate";

export default function(value, name, check, expected) {
  validate("E_INVALID_PAR_TYPE", check, {
    expected: expected,
    name: name,
    value: value
  });
}
