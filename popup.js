import { getActiveTabURL, getQueryParams } from "./utils.js";


document.addEventListener("DOMContentLoaded", async () => {

    const activeTab = await getActiveTabURL();
    const domStatus = document.getElementById("status");
    const domArticles = document.getElementById("articles");
    const domButtons = document.getElementById('btns');

    if (activeTab.url.includes("https://scholar.google.com/scholar")) {

        domButtons.className = "btns btns-active";
        const { pageNumber, searchKey } = getQueryParams(activeTab);

        if (pageNumber && searchKey) {
            chrome.storage.sync.get(["__google_scholar_search_result"], (data) => {

                const { currentPageNumber,
                    currentTotalResults,
                    currentTotalPages,
                    currentSearchKey } = data["__google_scholar_search_result"]["searchResult"];

                if (currentTotalResults && searchKey === currentSearchKey) {
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