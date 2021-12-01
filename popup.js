const loadStrikeData = async () => {
    return JSON.parse(await (await fetch('https://gitcdn.link/cdn/jamespizzurro/picket-line-notifier/main/data/strikes.json', {cache: 'no-cache'})).text());
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