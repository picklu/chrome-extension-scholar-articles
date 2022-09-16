(() => {

    let currentPageNumber;
    let currentSearchKey;
    let currentTotalResults;
    let currentTotalPages;
    let currentArticles = [];
    let totalArticlesSaved = 0;

    chrome.runtime.onMessage.addListener((obj, sender, response) => {

        const { type, pageNumber, searchKey } = obj;

        switch (type) {
            case "NEW":
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
                            currentTotalResults,
                            totalArticlesSaved
                        };
                        chrome.storage.sync.set(data);
                    });
                }

                break;

            case "PREVIOUS":
                console.log(type, type === "PREVIOUS");
                if (currentPageNumber > 1) {
                    const previous_btn = document.querySelector(".gs_ico_nav_previous");
                    previous_btn.click();
                }
                break;

            case "SAVE":
                console.log(type, type === "SAVE");
                break;

            case "CLEAR":
                console.log(type, type === "CLEAR");
                chrome.storage.sync.get(["__google_scholar_search_result"], (data) => {
                    data["__google_scholar_search_result"]["articles"] = {};
                    chrome.storage.sync.set(data);
                });

                break;

            case "NEXT":
                console.log(type, type === "NEXT");
                if (currentPageNumber < currentTotalPages) {
                    const next_btn = document.querySelector(".gs_ico_nav_next");
                    next_btn.click();
                }
                break;

            default:
                console.log("What type of message is", type, "?");
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
