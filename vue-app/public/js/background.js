/* eslint-disable no-undef */
const color = "#3aa757";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log("Default background color set to %cgreen", `color: ${color}`);
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { type, url, init = undefined, preFn } = request;
  if (type === "fetch") {
    fetch(url, init)
      .then((res) => res[preFn]())
      .then((res) => sendResponse(res))
      .catch((err) => console.error(err));
  }
  return true;
});
