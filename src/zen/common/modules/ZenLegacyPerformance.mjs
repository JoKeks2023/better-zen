// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

const LEGACY_MAC_PREFS = [
  ["gfx.webrender.compositor", false],
  ["widget.macos.sidebar-blend-mode.behind-window", false],
  ["widget.macos.native-popovers", false],
  ["zen.view.grey-out-inactive-windows", false],
  ["zen.startup.smooth-scroll-in-tabs", false],
  ["zen.view.compact.animate-sidebar", false],
  ["zen.view.compact.show-sidebar-and-toolbar-on-hover", false],
  ["zen.view.sidebar-height-throttle", 1000],
  ["zen.glance.animation-duration", 150],
  ["zen.downloads.download-animation-duration", 250],
  ["zen.downloads.download-animation", false],
  ["zen.haptic-feedback.enabled", false],
  ["zen.updates.show-update-notification", false],
];

function shouldApplyLegacyMacProfile() {
  if (Services.prefs.getBoolPref("zen.performance.legacy-mac.enabled", false)) {
    return true;
  }

  if (!Services.prefs.getBoolPref("zen.performance.legacy-mac.auto-detect", true)) {
    return false;
  }

  return (
    Services.appinfo.OS === "Darwin" &&
    Services.appinfo.XPCOMABI.includes("x86_64")
  );
}

export default function applyLegacyMacPerformanceProfile() {
  if (!shouldApplyLegacyMacProfile()) {
    return;
  }

  window.gReduceMotionOverride = true;

  for (const [prefName, prefValue] of LEGACY_MAC_PREFS) {
    if (Services.prefs.prefHasUserValue(prefName)) {
      continue;
    }

    try {
      if (typeof prefValue === "boolean") {
        Services.prefs.setBoolPref(prefName, prefValue);
      } else {
        Services.prefs.setIntPref(prefName, prefValue);
      }
    } catch (error) {
      console.error(
        "ZenLegacyPerformance: Failed to apply pref",
        prefName,
        error
      );
    }
  }
}