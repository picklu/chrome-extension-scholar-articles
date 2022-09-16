
export async function getActiveTabURL() {
    const tabs = await chrome.tabs.query({
        currentWindow: true,
        active: true
    });

    return tabs[0];
}

export function getQueryParams(activeTab) {
    const queryParameters = activeTab.url.split("?")[1];
    const urlParameters = new URLSearchParams(queryParameters);
    const pageNumber = Number(urlParameters.get("start")) / 10 + 1;
    const searchKey = urlParameters.get("q");

    return { pageNumber, searchKey };
}

export async function clickHandler(e) {
    const type = e.target.dataset.for.toUpperCase();
    const tab = await getActiveTabURL();
    chrome.tabs.sendMessage(tab.id, { type });
}

function save() {
    var htmlContent = [document.getElementsByTagName('html')];
    var bl = new Blob(htmlContent, { type: "text/html" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(bl);
    a.download = "your-download-name-here.html";
    a.hidden = true;
    document.body.appendChild(a);
    a.innerHTML = "something random - nobody will see this, it doesn't matter what you put here";
    a.click();
}