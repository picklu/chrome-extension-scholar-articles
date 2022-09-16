(() => {
    let currentPageNumber;
    let currentQueryParam;
    let currentTotalResults;
    let currentTotalPages;
    let currentArticles = [];

    chrome.runtime.onMessage.addListener((obj, sender, response) => {

        const { type, pageNumber, queryParam } = obj;

        if (type === "NEW") {
            currentPageNumber = pageNumber;
            currentQueryParam = queryParam;
            totalResults = getSearchResultStat();
            if (totalResults) {
                currentTotalResults = totalResults;
                currentTotalPages = Math.ceil(totalResults / 10);
                chrome.storage.sync.set({
                    [currentQueryParam]: { currentPageNumber, currentTotalResults, currentTotalPages }
                });
            }
        }
    });

    const getSearchResultStat = () => {
        const domTotalResults = document.getElementsByClassName("gs_ab_mdw")[1];
        if (domTotalResults) {
            let txtTotalResults = domTotalResults.innerText;
            while (txtTotalResults.indexOf(",") >= 0) {
                txtTotalResults = txtTotalResults.replace(",", "");
            }
            let matches = txtTotalResults.match(/about\s(\d+)\sresults/i);
            return Number(matches[1] || 0);
        } else {
            return 0;
        }
    }
})();
