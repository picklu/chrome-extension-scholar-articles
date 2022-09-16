import { getActiveTabURL } from "./utils.js";


document.addEventListener("DOMContentLoaded", async () => {
    const activeTab = await getActiveTabURL();
    const domStatus = document.getElementById("status");
    const domArticles = document.getElementById("articles");
    const domButtons = document.getElementById('btns');
    if (activeTab.url.includes("https://scholar.google.com/scholar")) {
        domButtons.className = "btns btns-active";
        const queryParameters = activeTab.url.split("?")[1];
        const urlParameters = new URLSearchParams(queryParameters);
        const pageNumber = Number(urlParameters.get("start")) / 10 + 1;
        const queryParam = urlParameters.get("q");
        if (pageNumber && queryParam) {
            chrome.storage.sync.get([queryParam], (data) => {
                const currentSearchresults = data[queryParam] || {};
                const { currentPageNumber, currentTotalResults, currentTotalPages } = currentSearchresults;
                if (currentTotalResults && pageNumber === currentPageNumber) {
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