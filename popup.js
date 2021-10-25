function setPageMaxWidth() {
  chrome.storage.sync.get("width", ({ width }) => {
    document.body.style.maxWidth = width || null;
  });
}

document.querySelectorAll("button").forEach(($button) => {
  $button.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    const width = $button.value;

    if (width === "disable") {
      chrome.action.setBadgeText({ text: "" });
      chrome.storage.sync.remove("width");
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: setPageMaxWidth,
      });
    } else {
      chrome.action.setBadgeText({ text: "ON" });
      chrome.storage.sync.set({ width });
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: setPageMaxWidth,
      });
    }
  });
});
