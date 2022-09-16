import { getActiveTabURL, getQueryParams } from "./utils.js";


document.addEventListener("DOMContentLoaded", async () => {

    const activeTab = await getActiveTabURL();
    const domStatus = document.getElementById("status");
    const domArticles = document.getElementById("articles");
    const domButtons = document.getElementById('btns');

    if (activeTab.url.includes("https://scholar.google.com/scholar")) {

        domButtons.className = "btns btns-active";
        const { pageNumber, queryParam } = getQueryParams(activeTab);

        if (pageNumber && queryParam) {
            chrome.storage.sync.get(["__google_scholar_search_result"], (data) => {

                const { currentPageNumber,
                    currentTotalResults,
                    currentTotalPages,
                    currentQueryParam } = data["__google_scholar_search_result"]["searchResult"];

                if (currentTotalResults && queryParam === currentQueryParam) {
                    domArticles.innerText = `[${currentTotalResults}] Page ${currentPageNumber} of ${currentTotalPages}`
                } else {
                    domArticles.innerText = "Not Found!"
                }
            });
        }
    } else {
        domButtons.className = "btns btns-hidden";
        domStatus.innerHTML = '<p class="status-message">This is not Google Scholar page for articles!</p>';
    }
})