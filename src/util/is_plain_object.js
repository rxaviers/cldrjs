/**
 * Function inspired by jQuery Core, but reduced to our use case.
 */
export default function(obj) {
  return obj !== null && "" + obj === "[object Object]";
}
