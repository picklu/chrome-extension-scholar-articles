(() => {

    let currentPageNumber;
    let currentSearchKey;
    let currentTotalResults;
    let currentTotalPages;
    let currentArticles = [];

    chrome.runtime.onMessage.addListener((obj, sender, response) => {

        const { type, pageNumber, searchKey } = obj;

        if (type === "NEW") {
            currentPageNumber = pageNumber;
            currentSearchKey = searchKey;
            totalResults = getSearchResultStat();
            if (totalResults) {
                currentTotalResults = totalResults;
                currentTotalPages = Math.ceil(totalResults / 10);
                chrome.storage.sync.get(["__google_scholar_search_result"], (data) => {
                    data["__google_scholar_search_result"]["searchResult"] = {
                        currentSearchKey,
                        currentPageNumber,
                        currentTotalPages,
                        currentTotalResults
                    };
                    chrome.storage.sync.set(data);
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
