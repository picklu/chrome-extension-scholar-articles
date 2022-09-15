import { getActiveTabURL } from "./utils.js";


document.addEventListener("DOMContentLoaded", async () => {
    const activeTab = await getActiveTabURL();
    if (activeTab.url.includes("https://scholar.google.com/scholar")) {
        const queryParameters = activeTab.url.split("?")[1];
        const urlParameters = new URLSearchParams(queryParameters);
        const currentPageNumber = Number(urlParameters.get("start")) / 10 + 1;
        const queryParam = urlParameters.get("q");
        if (currentPageNumber && queryParam) {
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
            });
        }
    } else {
        const status = document.getElementsByClassName("status")[0];
        status.innerHTML = '<p class="status-message">This is not Google Scholar page for articles!</p>';
    }
});
