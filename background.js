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
    const queryParameters = tab.url.split("?")[1];
    const urlParameters = new URLSearchParams(queryParameters);

    let pageNumber = Number(urlParameters.get("start") || "0") / articlesPerPage + 1;
    let searchKey = urlParameters.get("q");

    pageNumber = pageNumber ? pageNumber : 0;
    searchKey = searchKey ? searchKey : "cited articles";

    chrome.tabs.sendMessage(tabId, {
      type: "NEW",
      pageNumber,
      searchKey
    });
  }
});

