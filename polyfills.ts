/**
 * Runtime methods that lowering `browserslist` does not fix.
 *
 * SWC rewrites modern *syntax* down to the browserslist floor, but it cannot
 * invent methods that an old engine simply does not have. Three of these turned
 * up in the shipped bundles, and each one throws a TypeError that aborts
 * hydration on exactly the devices the ads reach:
 *
 *   Object.hasOwn          Chrome 93 / Safari 15.4   (4 call sites)
 *   Array.prototype.at     Chrome 92 / Safari 15.4
 *   String.prototype.replaceAll  Chrome 85 / Safari 13.1
 *
 * Next only injects polyfills for fetch, URL and Object.assign, so these are
 * ours to provide. Each is feature-detected, so on a current browser this file
 * costs a few bytes and does nothing.
 */

if (!Object.hasOwn) {
  Object.defineProperty(Object, "hasOwn", {
    value: function hasOwn(target: object, property: PropertyKey) {
      if (target == null) {
        throw new TypeError("Cannot convert undefined or null to object");
      }
      return Object.prototype.hasOwnProperty.call(Object(target), property);
    },
    configurable: true,
    writable: true,
  });
}

if (!Array.prototype.at) {
  Object.defineProperty(Array.prototype, "at", {
    value: function at(this: unknown[], index: number) {
      const len = this.length;
      // `at` counts back from the end for a negative index.
      const i = Math.trunc(index) || 0;
      const resolved = i < 0 ? len + i : i;
      return resolved < 0 || resolved >= len ? undefined : this[resolved];
    },
    configurable: true,
    writable: true,
  });
}

if (!String.prototype.replaceAll) {
  Object.defineProperty(String.prototype, "replaceAll", {
    value: function replaceAll(
      this: string,
      pattern: string | RegExp,
      replacement: string
    ) {
      if (pattern instanceof RegExp) {
        if (!pattern.global) {
          throw new TypeError(
            "replaceAll must be called with a global RegExp"
          );
        }
        return this.replace(pattern, replacement);
      }
      // Split/join avoids having to escape the pattern for a RegExp.
      return this.split(pattern).join(replacement);
    },
    configurable: true,
    writable: true,
  });
}

export {};
