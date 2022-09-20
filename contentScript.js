(() => {

    let currentPageNumber;
    let currentSearchKey;
    let totalArticlesSaved = 0;
    let currentArticles = [];
    const storageKey = "__google_scholar_search_result";
    const searchResutlKey = "searchResult";


    chrome.runtime.onMessage.addListener((obj, sender, response) => {

        const { type, pageNumber, searchKey } = obj;

        switch (type) {

            case "NEW":
                registerNewData(pageNumber, searchKey);
                break;

            default:
                console.log("What type of message is", type, "?");
        }
    });

    // message = "NEW"
    const registerNewData = (pageNumber, searchKey) => {
        totalResults = getSearchResultStat();
        if (totalResults) {
            chrome.storage.sync.get([storageKey], (data) => {
                currentPageNumber = data[storageKey][searchResutlKey]["currentPageNumber"];
                currentSearchKey = data[storageKey][searchResutlKey]["currentSearchKey"];
                totalArticlesSaved = data[storageKey][searchResutlKey]["totalArticlesSaved"];

                if (searchKey !== currentSearchKey) {
                    // reset stored data 
                    currentSearchKey = searchKey;
                    totalArticlesSaved = 0;

                    if (pageNumber !== currentPageNumber) {
                        currentPageNumber = pageNumber;
                    }
                }
                else {
                    if (pageNumber !== currentPageNumber) {
                        currentPageNumber = pageNumber;
                    }
                }

                data[storageKey][searchResutlKey] = {
                    currentPageNumber,
                    currentSearchKey,
                    totalArticlesSaved
                }

                // save to storage
                updateStoredData(data);
            });

            updateDomWithXtendedElement();
        }
    }


    const updateDomWithXtendedElement = () => {
        addCheckBoxes();
        addDownloadButton();
    }

    const addCheckBoxes = () => {
        const xDOMGSTop = document.getElementById("gs_res_ccl_top");
        if (xDOMGSTop) {
            const xDOMMainCheckBoxLabel = document.createElement("label");
            xDOMMainCheckBoxLabel.setAttribute("for", "gsx-all");
            xDOMMainCheckBoxLabel.innerText = "Select all articles";
            const xDOMMainCheckBox = document.createElement("input");
            xDOMMainCheckBox.setAttribute("type", "checkbox");
            xDOMMainCheckBox.setAttribute("id", "gsx-all");
            xDOMMainCheckBox.style.border = "2px solid #0000fb";
            xDOMMainCheckBox.addEventListener("click", onClickMainCheckBox);
            xDOMMainCheckBoxLabel.append(xDOMMainCheckBox);
            xDOMGSTop.prepend(xDOMMainCheckBoxLabel);
        }

        const xDOMArticleContainer = document.getElementById("gs_res_ccl_mid");
        if (xDOMArticleContainer) {
            for (let xDOMArticle of xDOMArticleContainer.children) {
                const xDOMCheckBox = document.createElement("input");
                xDOMCheckBox.setAttribute("class", "gsx-article");
                xDOMCheckBox.setAttribute("type", "checkbox");
                xDOMCheckBox.addEventListener("click", onClickCheckBox);
                xDOMArticle.prepend(xDOMCheckBox);
            }

        } else {
            console.log("Div with id of 'gs_res_ccl_mid' not found!");
        }
    }

    const addDownloadButton = () => {
        const xDOMGSTop = document.getElementById("gs_top");
        if (xDOMGSTop) {
            const xDOMButton = document.createElement("button");
            xDOMButton.setAttribute = ("type", "button");
            xDOMButton.setAttribute = ("z-index", 10);
            xDOMButton.innerHTML = "DOWNLOAD";
            xDOMButton.style.width = "15rem";
            xDOMButton.style.height = "3rem";
            xDOMButton.style.borderRadius = "50px 0 0 50px";
            xDOMButton.style.border = "1px solid transparent";
            xDOMButton.style.lineHeight = 3;
            xDOMButton.style.fontSize = "1rem";
            xDOMButton.style.textAlign = "left";
            xDOMButton.style.paddingLeft = "1rem";
            xDOMButton.style.color = "#fbfbfb";
            xDOMButton.style.boxShadow = "2px 2px 2px 0 #999";
            xDOMButton.style.backgroundColor = "rgba(35,33,179, 0.9)";

            xDOMButton.style.position = "fixed";
            xDOMButton.style.right = 0;
            xDOMButton.style.bottom = "50%";
            xDOMButton.style.marginRight = "-1rem";

            xDOMButton.addEventListener("mouseover", onMouseOverDBtn);
            xDOMButton.addEventListener("mouseout", onMouseOutDBtn);
            xDOMButton.addEventListener("mousedown", onMouseDownDBtn);
            xDOMButton.addEventListener("click", onClickDBtn);
            xDOMGSTop.append(xDOMButton);

        } else {
            console.log("Div with id of 'gs_top' not found!");
        }
    }


    const onClickMainCheckBox = (e) => {
        const xCheckBoxes = document.getElementsByClassName("gsx-article");
        for (let xCheckBox of xCheckBoxes) {
            if (e.target.checked) {
                xCheckBox.checked = true;
                xCheckBox.parentElement.style.backgroundColor = "rgba(35, 33, 150, 0.2)";
            } else {
                xCheckBox.checked = false;
                xCheckBox.parentElement.style.backgroundColor = "#fff";
            }
        }
    }

    const onClickCheckBox = (e) => {
        if (e.target.checked) {
            e.target.parentElement.style.backgroundColor = "rgba(35, 33, 150, 0.2)";
        } else {
            e.target.parentElement.style.backgroundColor = "#ffffff";
        }
    }

    const onMouseDownDBtn = (e) => {
        e.target.style.backgroundColor = "rgba(35,33,179, 0.7)";
    }

    const onMouseOverDBtn = (e) => {
        e.target.style.backgroundColor = "rgba(35,33,179, 0.8)";
    }

    const onMouseOutDBtn = (e) => {
        e.target.style.backgroundColor = "rgba(35,33,179, 0.9)";
    }

    const onClickDBtn = (e) => {
        if (addArticlesToQueue()) {
            downArticles();
        }
    }


    const addArticlesToQueue = () => {
        const articles = [];
        const domArticleContainer = document.getElementById("gs_res_ccl_mid");
        if (domArticleContainer) {
            const domArticles = domArticleContainer.children;
            for (let domArticle of domArticles) {
                const xCheckBox = domArticle.getElementsByClassName("gsx-article")[0];
                if (xCheckBox.checked) {
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
        }

        currentArticles = [...articles];
        return currentArticles.length;
    }


    const downArticles = () => {
        chrome.storage.sync.get([storageKey], (data) => {
            const searchParams = data[storageKey][searchResutlKey];
            totalArticlesSaved = searchParams["totalArticlesSaved"] + currentArticles.length;
            searchParams["totalArticlesSaved"] = totalArticlesSaved;
            chrome.storage.sync.set(data);
            const fileName = `${currentSearchKey}_${currentArticles.length}_${new Date().getTime()}`;
            const dataObj = { [fileName]: currentArticles }
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataObj));
            const downloadNode = document.createElement("a");
            downloadNode.setAttribute("href", dataStr);
            downloadNode.setAttribute("download", fileName + ".json");
            document.body.appendChild(downloadNode);
            downloadNode.click();
            downloadNode.remove();
        });
    }


    const getSearchResultStat = () => {
        const domTotalResults = document.getElementsByClassName("gs_ab_mdw")[1];
        if (domTotalResults) {
            let txtTotalResults = domTotalResults ? domTotalResults.innerText : "";
            while (txtTotalResults.indexOf(",") >= 0) {
                txtTotalResults = txtTotalResults.replace(",", "");
            }
            let matches = txtTotalResults.match(/(about\s)?(\d+)\sresults/i);
            return matches && matches.length > 0 ? Number(matches[2]) : 0;
        } else {
            return 0;
        }
    }

    const updateStoredData = (data) => {
        data[storageKey][searchResutlKey] = {
            currentPageNumber,
            currentSearchKey,
            totalArticlesSaved
        };
        chrome.storage.sync.set(data);
    }

    // const calcTotalArticlesSaved = (articles) => {
    //     let total = 0;
    //     Object.keys(articles).forEach(aa => {
    //         total = total + articles[aa].length;
    //     });
    //     return total;
    // }

})();
