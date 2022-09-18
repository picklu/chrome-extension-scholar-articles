(() => {

    let currentPageNumber;
    let currentSearchKey;
    let currentTotalResults;
    let currentTotalPages;
    let currentArticles = [];
    let totalArticlesSaved = 0;
    let articlesPerPage = 20;

    chrome.runtime.onMessage.addListener((obj, sender, response) => {

        const { type, pageNumber, searchKey } = obj;

        switch (type) {

            case "NEW":
                registerNewData();
                break;

            case "PREVIOUS":
                gotToPreviousPage();
                break;

            case "SAVE":
                saveArticlesAndGoToNextPage();
                break;

            case "CLEAR":
                clearStoredData();
                break;

            case "NEXT":
                gotToNextPage();
                break;

            default:
                console.log("What type of message is", type, "?");
        }
    });


    const getArticles = () => {
        const articles = [];
        const domArticleContainer = document.getElementById("gs_res_ccl_mid");
        if (domArticleContainer) {
            const domArticles = domArticleContainer.children;
            for (let domArticle of domArticles) {
                const article = {};
                article["title"] = domArticle.querySelector("h3>a[href]") ?
                    domArticle.querySelector("h3>a[href]").innerText : "Not found";
                article["link"] = domArticle.querySelector("h3>a[href]") ?
                    domArticle.querySelector("h3>a[href]").href : "#";
                article["abstract"] = domArticle.querySelector("div.gs_rs") ?
                    domArticle.querySelector("div.gs_rs").innerText : "Not found";
                if (article["link"] === "#") continue
                articles.push(article);
            }
        }
        return articles;
    }

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


    // const calcTotalArticlesSaved = (articles) => {
    //     let total = 0;
    //     Object.keys(articles).forEach(aa => {
    //         total = total + articles[aa].length;
    //     });
    //     return total;
    // }

    // message = "NEW"
    const registerNewData = () => {
        totalResults = getSearchResultStat();
        if (totalResults) {

            chrome.storage.sync.get(["__google_scholar_search_result"], (data) => {
                const storedData = data["__google_scholar_search_result"]["searchResult"];
                currentPageNumber = storedData["currentPageNumber"];
                currentSearchKey = storedData["currentSearchKey"];
                totalArticlesSaved = storedData["totalArticlesSaved"];

                // reset stored data if the search key is new
                if (searchKey !== currentSearchKey) {
                    currentSearchKey = searchKey;
                    totalArticlesSaved = 0;
                }

                if (pageNumber !== currentPageNumber) {
                    currentTotalResults = totalResults;
                    currentTotalPages = Math.floor(totalResults / articlesPerPage);
                    currentPageNumber = pageNumber;
                    currentArticles = getArticles();


                    storedData["searchResult"] = {
                        currentSearchKey,
                        currentPageNumber,
                        currentTotalPages,
                        currentTotalResults,
                        totalArticlesSaved
                    };
                    chrome.storage.sync.set(data);
                }
            });
        }
    }


    // message = "PREVIOUS"
    const gotToPreviousPage = () => {
        if (currentPageNumber > 1) {
            const previous_btn = document.querySelector(".gs_ico_nav_previous");
            if (previous_btn) { previous_btn.click() }
        }
    }


    // message = "SAVE"
    const saveArticlesAndGoToNextPage = () => {
        chrome.storage.sync.get(["__google_scholar_search_result"], (data) => {
            const searchParams = data["__google_scholar_search_result"]["searchResult"];
            searchParams["totalArticlesSaved"] = searchParams["totalArticlesSaved"] + currentArticles.length;
            chrome.storage.sync.set(data);
            saveArticlesAsJsonFile();
            if (currentPageNumber < currentTotalPages) {
                const next_btn = document.querySelector(".gs_ico_nav_next");
                if (next_btn) { next_btn.click() }
            }
        });
    }


    // message = "CLEAR"
    const clearStoredData = () => {
        chrome.storage.sync.get(["__google_scholar_search_result"], (data) => {
            data["__google_scholar_search_result"]["searchResult"]["totalArticlesSaved"] = 0;
            chrome.storage.sync.set(data);
        });
    }


    // message = "NEXT"
    const gotToNextPage = () => {
        if (currentPageNumber < currentTotalPages) {
            const next_btn = document.querySelector(".gs_ico_nav_next");
            if (next_btn) { next_btn.click() }
        }
    }


    const saveArticlesAsJsonFile = () => {
        if (currentSearchKey && currentPageNumber) {
            const fileName = `${currentSearchKey}-${currentPageNumber}`;
            const dataObj = { [fileName]: currentArticles }
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataObj));
            const downloadNode = document.createElement("a");
            downloadNode.setAttribute("href", dataStr);
            downloadNode.setAttribute("download", fileName + ".json");
            document.body.appendChild(downloadNode);
            downloadNode.click();
            downloadNode.remove();
        }
    }
})();
