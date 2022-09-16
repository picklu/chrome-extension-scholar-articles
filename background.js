const initialData = {
  "__google_scholar_search_result": {
    "searchResult": {},
    "articles": {}
  }
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set(initialData);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url && tab.url.includes("https://scholar.google.com/scholar")) {
    const queryParameters = tab.url.split("?")[1];
    const urlParameters = new URLSearchParams(queryParameters);

    const pageNumber = Number(urlParameters.get("start")) / 10 + 1;
    const queryParam = urlParameters.get("q");

    chrome.tabs.sendMessage(tabId, {
      type: "NEW",
      pageNumber: pageNumber,
      queryParam: queryParam
    });
  }
});