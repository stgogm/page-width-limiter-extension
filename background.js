let active;

const getCSS = (width) => `html { max-width: ${width}; margin: 0 auto; }`;
const applyStyles = async (tabId) => {
  if (tabId !== active) {
    return Promise.resolve();
  }

  chrome.storage.sync.get(String(active), async ({ [active]: width }) => {
    console.log("tab", active, "width", width);

    if (width) {
      try {
        await chrome.scripting.insertCSS({
          target: { tabId: active },
          css: getCSS(width),
        });

        return chrome.action.setBadgeText({ text: "ON" });
      } catch {}
    }

    return chrome.action.setBadgeText({ text: "" });
  });
};

chrome.tabs.onUpdated.addListener((tabId) => applyStyles(tabId));

chrome.tabs.onActivated.addListener(({ tabId }) => {
  active = tabId;

  applyStyles(tabId);
});

chrome.runtime.onMessage.addListener(async ({ width }) => {
  const tabId = String(active);

  return chrome.storage.sync.get(tabId, async ({ [tabId]: curr }) => {
    if (curr) {
      try {
        await chrome.scripting.removeCSS({
          target: { tabId: active },
          css: getCSS(curr),
        });
      } catch {}
    }

    if (width) {
      await chrome.storage.sync.set({ [tabId]: width });
    } else {
      await chrome.storage.sync.remove(tabId);
    }

    await applyStyles(active);

    return true;
  });
});
