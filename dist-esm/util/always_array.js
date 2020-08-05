import arrayIsArray from "./array/is_array";
export default function (somethingOrArray) {
  return arrayIsArray(somethingOrArray) ? somethingOrArray : [somethingOrArray];
}