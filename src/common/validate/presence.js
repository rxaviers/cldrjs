import validate from "../validate";

export default function(value, name) {
  validate("E_MISSING_PARAMETER", typeof value !== "undefined", {
    name: name
  });
}
