import resourceGet from "../resource/get";
import pathNormalize from "../path/normalize";

export default function(Cldr, path, attributes) {
  // Resolve path
  var normalizedPath = pathNormalize(path, attributes);

  return resourceGet(Cldr._resolved, normalizedPath);
}
