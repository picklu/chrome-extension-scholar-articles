const articlesPerPage = 20;

export async function getActiveTabURL() {
    const tabs = await chrome.tabs.query({
        currentWindow: true,
        active: true
    });

    return tabs[0];
}

export function getQueryParams(activeTab) {
    const queryParameters = activeTab.url.split("?")[1];
    const urlParameters = new URLSearchParams(queryParameters);
    const pageNumber = Number(urlParameters.get("start") || 0) / articlesPerPage + 1;
    const searchKey = urlParameters.get("q");

    return { pageNumber, searchKey };
}

export async function clickHandler(e) {
    const type = e.target.dataset.for.toUpperCase();
    const tab = await getActiveTabURL();
    chrome.tabs.sendMessage(tab.id, { type });
}
