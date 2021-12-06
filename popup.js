const STRIKES_STORAGE_KEY = 'strikes';

const loadStrikeData = () => {
    // background.js should have already loaded strike data into our app cache

    return new Promise(resolve => {
        chrome.storage.local.get(STRIKES_STORAGE_KEY, items => {
            if (!items || !items[STRIKES_STORAGE_KEY]) {
                console.warn("No strike data in app cache! This is unexpected. Rendering an empty strike list for now.");
                resolve({});
            } else {
                resolve(items[STRIKES_STORAGE_KEY]);
            }
        });
    });
};

(async () => {
    const strikesByOrgName = await loadStrikeData();

    const strikeList = document.getElementById('strike-list');
    for (const [orgName, strike] of Object.entries(strikesByOrgName).sort((a, b) => a[0].toUpperCase().localeCompare(b[0].toUpperCase()))) {
        const strikeListItemLinkText = document.createTextNode(orgName);

        const strikeListItemLink = document.createElement('a');
        strikeListItemLink.href = strike.moreInfoUrl;
        strikeListItemLink.rel= "noopener noreferrer";
        strikeListItemLink.target= "_blank";
        strikeListItemLink.appendChild(strikeListItemLinkText);
        
        const strikeListItem = document.createElement('li');
        strikeListItem.appendChild(strikeListItemLink);
        
        strikeList.appendChild(strikeListItem);
    }
})();