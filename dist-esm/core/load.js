import coreSetAvailableBundles from "./set_available_bundles";
import validatePresence from "../common/validate/presence";
import validateTypePlainObject from "../common/validate/type/plain_object";
import alwaysArray from "../util/always_array";
import jsonMerge from "../util/json/merge";
/**
 * load( Cldr, source, jsons )
 *
 * @Cldr [Cldr class]
 *
 * @source [Object]
 *
 * @jsons [arguments]
 */

export default function (Cldr, source, jsons) {
  var i, j, json;
  process.env.NODE_ENV !== "production" ? validatePresence(jsons[0], "json") : void 0; // Support arbitrary parameters, e.g., `Cldr.load({...}, {...})`.

  for (i = 0; i < jsons.length; i++) {
    // Support array parameters, e.g., `Cldr.load([{...}, {...}])`.
    json = alwaysArray(jsons[i]);

    for (j = 0; j < json.length; j++) {
      process.env.NODE_ENV !== "production" ? validateTypePlainObject(json[j], "json") : void 0;
      source = jsonMerge(source, json[j]);
      coreSetAvailableBundles(Cldr, json[j]);
    }
  }

  return source;
}