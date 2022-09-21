const storageKey = "__google_scholar_search_result";
const searchResutlKey = "searchResult";
const articlesKey = "articles";
const articlesPerPage = 20;
const initialData = {
  [storageKey]: {
    [searchResutlKey]: {},
    [articlesKey]: {}
  }
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set(initialData);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url && tab.url.includes("https://scholar.google.com/scholar")) {
    chrome.tabs.sendMessage(tabId, {
      type: "NEW"
    });
  }
});

