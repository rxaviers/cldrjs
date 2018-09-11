import createError from "./create_error";

export default function(code, check, attributes) {
  if (!check) {
    throw createError(code, attributes);
  }
}
