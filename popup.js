import { getActiveTabURL } from "./utils.js";


document.addEventListener("DOMContentLoaded", async () => {
    const activeTab = await getActiveTabURL();
    const domStatus = document.getElementById("status");
    const domButtons = document.getElementById('btns');
    if (activeTab.url.includes("https://scholar.google.com/scholar")) {
        domButtons.className = "btns btns-active";
        const queryParameters = activeTab.url.split("?")[1];
        const urlParameters = new URLSearchParams(queryParameters);
        const currentPageNumber = Number(urlParameters.get("start")) / 10 + 1;
        const queryParam = urlParameters.get("q");
        if (currentPageNumber && queryParam) {
            chrome.storage.sync.get([queryParam], (data) => {
                const currentArticles = data[queryParam] ? JSON.parse(data[queryParam]) : {};
            });
        }
    } else {
        domButtons.className = "btns btns-hidden";
        domStatus.innerHTML = '<p class="status-message">This is not Google Scholar page for articles!</p>';
    }
});
