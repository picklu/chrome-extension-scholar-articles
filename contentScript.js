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

                totalResults = getSearchResultStat();
                if (totalResults) {

                    chrome.storage.sync.get(["__google_scholar_search_result"], (data) => {
                        const storedData = data["__google_scholar_search_result"];
                        if (pageNumber !== currentPageNumber || searchKey !== currentSearchKey) {
                            currentTotalResults = totalResults;
                            currentTotalPages = Math.ceil(totalResults / 10);
                            currentArticles = getArticles();
                            currentPageNumber = pageNumber;
                            currentSearchKey = searchKey;
                            // articles[searchKey + "-" + pageNumber] = currentArticles;
                            // totalArticlesSaved = calcTotalArticlesSaved(articles);

                            totalArticlesSaved = storedData["searchResult"]["totalArticlesSaved"] || totalArticlesSaved;

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

                break;

            case "PREVIOUS":
                // console.log(type, type === "PREVIOUS");
                if (currentPageNumber > 1) {
                    const previous_btn = document.querySelector(".gs_ico_nav_previous");
                    if (previous_btn) { previous_btn.click() }
                }
                break;

            case "SAVE":
                console.log(type, type === "SAVE");
                chrome.storage.sync.get(["__google_scholar_search_result"], (data) => {
                    const searchParams = data["__google_scholar_search_result"]["searchResult"];
                    searchParams["totalArticlesSaved"] = searchParams["totalArticlesSaved"] + currentArticles.length;
                    chrome.storage.sync.set(data);
                });
                break;

            case "CLEAR":
                // console.log(type, type === "CLEAR");
                chrome.storage.sync.get(["__google_scholar_search_result"], (data) => {
                    data["__google_scholar_search_result"]["articles"] = {};
                    chrome.storage.sync.set(data);
                });

                break;

            case "NEXT":
                // console.log(type, type === "NEXT");
                if (currentPageNumber < currentTotalPages) {
                    const next_btn = document.querySelector(".gs_ico_nav_next");
                    if (next_btn) { next_btn.click() }
                }
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
                    domArticle.querySelector("div.gs_rs").innerText : "NOt found";
                // console.log(article);
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


    const calcTotalArticlesSaved = (articles) => {
        let total = 0;
        Object.keys(articles).forEach(aa => {
            total = total + articles[aa].length;
        });
        return total;
    }


    const saveArticlesAsJson = (fileName, fileContent) => {
        const bl = new Blob(fileContent, { type: "text/json" });
        const domAnchor = document.createElement("a");
        domAnchor.href = URL.createObjectURL(bl);
        domAnchor.download = fileName + ".json";
        domAnchor.hidden = true;
        document.body.appendChild(a);
        domAnchor.innerHTML = "Download data as a json file";
        domAnchor.click();
        domAnchor.remove();
    }
})();
