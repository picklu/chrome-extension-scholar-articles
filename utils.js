
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
    const pageNumber = Number(urlParameters.get("start")) / 10 + 1;
    const queryParam = urlParameters.get("q");

    return { pageNumber, queryParam };
}