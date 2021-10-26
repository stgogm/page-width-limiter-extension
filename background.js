const getCSS = (width) =>
  `:root { max-width: ${width} !important; margin: 0 auto !important; }`;

const applyStyles = async (tabId) => {
  const tabIdStr = String(tabId)

  return chrome.storage.sync.get(tabIdStr, async ({ [tabIdStr]: width }) => {
    if (width) {
      try {
        await chrome.scripting.insertCSS({
          target: { tabId: tabId },
          css: getCSS(width),
        });

        return chrome.action.setBadgeText({ text: "ON" });
      } catch {}
    }

    return chrome.action.setBadgeText({ text: "" });
  });
};

chrome.tabs.onActivated.addListener(({ tabId }) => applyStyles(tabId));
chrome.tabs.onUpdated.addListener((tabId) => applyStyles(tabId));
chrome.runtime.onMessage.addListener(async ({ width }) => {
  const [tab] = await chrome.tabs.query({ active: true });
  const tabIdStr = String(tab.id);

  return chrome.storage.sync.get(tabIdStr, async ({ [tabIdStr]: curr }) => {
    if (curr) {
      try {
        await chrome.scripting.removeCSS({
          target: { tabId: tab.id },
          css: getCSS(curr),
        });
      } catch {}
    }

    if (width) {
      await chrome.storage.sync.set({ [tabIdStr]: width });
    } else {
      await chrome.storage.sync.remove(tabIdStr);
    }

    await applyStyles(tab.id);

    return true;
  });
});
