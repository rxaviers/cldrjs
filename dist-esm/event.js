import EventEmitter from "wolfy87-eventemitter";
import validatePresence from "./common/validate/presence";
import validateType from "./common/validate/type";
import validateTypeFunction from "./common/validate/type/function";
import Cldr from "./core";
import pathNormalize from "./path/normalize";
var superGet,
    superInit,
    globalEe = new EventEmitter();

function validateTypeEvent(value, name) {
  process.env.NODE_ENV !== "production" ? validateType(value, name, typeof value === "string" || value instanceof RegExp, "String or RegExp") : void 0;
}

function validateThenCall(method, self) {
  return function (event, listener) {
    process.env.NODE_ENV !== "production" ? validatePresence(event, "event") : void 0;
    validateTypeEvent(event, "event");
    process.env.NODE_ENV !== "production" ? validatePresence(listener, "listener") : void 0;
    process.env.NODE_ENV !== "production" ? validateTypeFunction(listener, "listener") : void 0;
    return self[method].apply(self, arguments);
  };
}

function off(self) {
  return validateThenCall("off", self);
}

function on(self) {
  return validateThenCall("on", self);
}

function once(self) {
  return validateThenCall("once", self);
}

Cldr.off = off(globalEe);
Cldr.on = on(globalEe);
Cldr.once = once(globalEe);
/**
 * Overload Cldr.prototype.init().
 */

superInit = Cldr.prototype.init;

Cldr.prototype.init = function () {
  var ee;
  this.ee = ee = new EventEmitter();
  this.off = off(ee);
  this.on = on(ee);
  this.once = once(ee);
  superInit.apply(this, arguments);
};
/**
 * getOverload is encapsulated, because of cldr/unresolved. If it's loaded
 * after cldr/event (and note it overwrites .get), it can trigger this
 * overload again.
 */


function getOverload() {
  /**
   * Overload Cldr.prototype.get().
   */
  superGet = Cldr.prototype.get;

  Cldr.prototype.get = function (path) {
    var value = superGet.apply(this, arguments);
    path = pathNormalize(path, this.attributes).join("/");
    globalEe.trigger("get", [path, value]);
    this.ee.trigger("get", [path, value]);
    return value;
  };
}

Cldr._eventInit = getOverload;
getOverload();
export default Cldr;