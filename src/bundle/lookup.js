import coreLikelySubtags from "../core/likely_subtags";
import coreRemoveLikelySubtags from "../core/remove_likely_subtags";
import coreSubtags from "../core/subtags";

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
    while (availableBundleMapQueue.length > 0) {
      const bundle = availableBundleMapQueue.shift();
      if (!bundle) {
        break;
      }

      var existing, maxBundle, minBundle, subtags;
      subtags = coreSubtags(bundle);
      maxBundle = coreLikelySubtags(Cldr, cldr, subtags);
      if (typeof maxBundle === "undefined") {
        throw new Error(`Could not find likelySubtags for ${bundle}`);
      }

      minBundle = coreRemoveLikelySubtags(Cldr, cldr, maxBundle);
      minBundle = minBundle.join(Cldr.localeSep);
      existing = availableBundleMap[minBundle];
      if (existing && existing.length < bundle.length) {
        return;
      }
      availableBundleMap[minBundle] = bundle;
    }
  }

  return availableBundleMap[minLanguageId] || null;
}
