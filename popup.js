import { getActiveTabURL, getQueryParams, clickHandler } from "./utils.js";

const storageKey = "__google_scholar_search_result";
const searchResutlKey = "searchResult";
// const articlesKey = "articles";


document.addEventListener("DOMContentLoaded", async () => {

    const activeTab = await getActiveTabURL();
    const domStatus = document.getElementById("status");
    const domArticles = document.getElementById("articles");
    const domButtons = document.getElementById('btns');

    if (activeTab.url.includes("https://scholar.google.com/scholar")) {

        domButtons.className = "btns btns-active";
        for (let domBtn of domButtons.children) {
            domBtn.addEventListener("click", clickHandler);
        }

        const { pageNumber, searchKey } = getQueryParams(activeTab);

        if (pageNumber && searchKey) {
            chrome.storage.sync.get([storageKey], (data) => {

                const { totalArticlesSaved,
                    currentPageNumber,
                    currentTotalResults,
                    currentTotalPages,
                    currentSearchKey } = data[storageKey][searchResutlKey];

                if (currentTotalResults && searchKey === currentSearchKey) {
                    domArticles.innerText = `[${totalArticlesSaved}/${currentTotalResults}] Page ${currentPageNumber} of ${currentTotalPages}`
                } else {
                    domArticles.innerText = "Not Found!"
                }
            });
        }
    } else {
        domButtons.className = "btns btns-hidden";
        domStatus.innerHTML = '<p class="status-message">This is not Google Scholar page for articles!</p>';
    }
});


chrome.storage.onChanged.addListener(() => {
    const domArticles = document.getElementById("articles");
    if (domArticles) {
        chrome.storage.sync.get([storageKey], (data) => {
            const { totalArticlesSaved,
                currentPageNumber,
                currentTotalResults,
                currentTotalPages,
                currentSearchKey } = data[storageKey][searchResutlKey];

            if (currentTotalResults && currentSearchKey) {
                domArticles.innerText = `[${totalArticlesSaved}/${currentTotalResults}] Page ${currentPageNumber} of ${currentTotalPages}`
            } else {
                domArticles.innerText = "Not Found!";
            }
        });
    }
});