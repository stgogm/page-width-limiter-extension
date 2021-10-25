document.querySelectorAll("button").forEach(($button) => {
  $button.addEventListener("click", () =>
    chrome.runtime.sendMessage({ width: $button.value })
  );
});
