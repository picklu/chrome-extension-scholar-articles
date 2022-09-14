import { getActiveTabURL } from "./utils.js";

const viewStats = (currentArticles) => {
    const domStats = document.getElementsByClassName("articles")[0];
    const totalArticles = 0;
    Object.keys(currentArticles).forEach(page => {
        totalArticles += currentArticles[page].length;
    });
    domStats.innerText = totalArticles;
};

document.addEventListener("DOMContentLoaded", async () => {
    const activeTab = await getActiveTabURL();
    if (activeTab.url.includes("https://scholar.google.com/scholar")) {
        const queryParameters = activeTab.url.split("?")[1];
        const urlParameters = new URLSearchParams(queryParameters);
        const pageNumber = Number(urlParameters.get("start")) / 10 + 1;
        const queryParam = urlParameters.get("q");
        if (pageNumber && queryParam) {
            const domContainer = document.getElementsByClassName("container")[0]
            const domButtons = document.createElement('div');
            const btnNames = {
                "btn-prev": "Previous",
                "btn-save": "Save",
                "btn-delete": "Delete",
                "btn-next": "Next"
            };
            Object.keys(btnNames).forEach(btnClassName => {
                let domButton = document.createElement("button");
                domButton.className = ["btn", btnClassName].join(" ");
                domButton.innerText = btnNames[btnClassName];
                domButtons.append(domButton);
            });
            domButtons.className = "btns";
            domContainer.append(domButtons);
            chrome.storage.sync.get([queryParam], (data) => {
                const currentArticles = data[queryParam] ? JSON.parse(data[queryParam]) : {};
                viewStats(currentArticles);
            });
        }
    } else {
        const status = document.getElementsByClassName("status")[0];
        status.innerHTML = '<h3 class="status-message">This is not Google Scholar page for articles</h3>';
    }
});
