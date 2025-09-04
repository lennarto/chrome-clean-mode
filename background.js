// Clean Mode Toggle – background logic (no badge, no bookmarks reminder)

let busy = false;

async function getSettings() {
  const {
    mode = "enabled",
    disabledSet = [],
    excludeIds = []
  } = await chrome.storage.local.get([
    "mode",
    "disabledSet",
    "excludeIds"
  ]);
  return { mode, disabledSet, excludeIds };
}

function filterToggleCandidates(all, selfId, excludeIds) {
  const exclude = new Set([...excludeIds, selfId]);
  return all.filter((it) => it.type === "extension" && !exclude.has(it.id));
}

async function enterCleanMode(candidates) {
  // disable all currently enabled candidates, remember them
  const toDisable = candidates.filter((it) => it.enabled);
  await chrome.storage.local.set({
    disabledSet: toDisable.map((x) => x.id),
    mode: "disabled",
  });

  await Promise.allSettled(
    toDisable.map((x) => chrome.management.setEnabled(x.id, false))
  );
}

async function exitCleanMode(candidates, disabledSet) {
  // re-enable exactly what we turned off before (and still exists)
  const previously = new Set(disabledSet);
  const toEnable = candidates.filter((it) => previously.has(it.id));

  await Promise.allSettled(
    toEnable.map((x) => chrome.management.setEnabled(x.id, true))
  );

  await chrome.storage.local.set({ disabledSet: [], mode: "enabled" });
}

chrome.action.onClicked.addListener(async () => {
  if (busy) return;
  busy = true;

  try {
    const selfId = chrome.runtime.id;
    const { mode, disabledSet, excludeIds } = await getSettings();
    const all = await chrome.management.getAll();
    const candidates = filterToggleCandidates(all, selfId, excludeIds);

    if (mode === "enabled") {
      await enterCleanMode(candidates);
    } else {
      await exitCleanMode(candidates, disabledSet);
    }
  } catch (err) {
    console.error("[Clean Mode Toggle] error:", err);
  } finally {
    busy = false;
  }
});

// Initialize defaults on install/update
chrome.runtime.onInstalled.addListener(async () => {
  const current = await chrome.storage.local.get(null);
  if (!("excludeIds" in current)) await chrome.storage.local.set({ excludeIds: [] });
  // Optional cleanup if you were on an older version:
  if ("bookmarksReminder" in current) {
    await chrome.storage.local.remove("bookmarksReminder");
  }
});
