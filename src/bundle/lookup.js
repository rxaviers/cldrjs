import coreLikelySubtags from "../core/likely_subtags";
import coreRemoveLikelySubtags from "../core/remove_likely_subtags";
import coreSubtags from "../core/subtags";
import arrayForEach from "../util/array/for_each";

/**
 * bundleLookup( minLanguageId )
 *
 * @Cldr [Cldr class]
 *
 * @cldr [Cldr instance]
 *
 * @minLanguageId [String] requested languageId after applied remove likely subtags.
 */
export default function(Cldr, cldr, minLanguageId) {
  var availableBundleMap = Cldr._availableBundleMap,
    availableBundleMapQueue = Cldr._availableBundleMapQueue;

  if (availableBundleMapQueue.length) {
    arrayForEach(availableBundleMapQueue, function(bundle) {
      var existing, maxBundle, minBundle, subtags;
      subtags = coreSubtags(bundle);
      maxBundle = coreLikelySubtags(Cldr, cldr, subtags);
      minBundle = coreRemoveLikelySubtags(Cldr, cldr, maxBundle);
      minBundle = minBundle.join(Cldr.localeSep);
      existing = availableBundleMap[minBundle];
      if (existing && existing.length < bundle.length) {
        return;
      }
      availableBundleMap[minBundle] = bundle;
    });
    Cldr._availableBundleMapQueue = [];
  }

  return availableBundleMap[minLanguageId] || null;
}
