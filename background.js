const NOTIFICATION_ID_PREFIX = `strike-`;

const loadStrikeData = async () => {
    var url = chrome.runtime.getURL('data/strikes.json');
    return JSON.parse(await (await fetch(url)).text());
};

const checkTab = async (tabId, windowId) => {
    chrome.tabs.query({
        active: true,
        lastFocusedWindow: true
    }, async tabs => {
        const strikesByOrgName = await loadStrikeData();

        // clear any existing notifications prior to (maybe) creating a new one
        for (const orgName of Object.keys(strikesByOrgName)) {
            chrome.notifications.clear(`${NOTIFICATION_ID_PREFIX}${orgName}`, wasCleared => {
                if (wasCleared) {
                    console.debug(`cleared Notification '${NOTIFICATION_ID_PREFIX}${orgName}'`);
                }
            });
        }

        if (!tabs) {
            return;
        }

        const tab = tabs.find(tab => tab.id === tabId && tab.windowId === windowId);
        if (!tab) {
            return;
        }

        const tabUrl = tab.url;
        if (!tabUrl) {
            return;
        }

        let matchingOrgName = null;

        for (const [orgName, strike] of Object.entries(strikesByOrgName)) {
            const matchingRegex = strike.matchingUrlRegexes.find(rx => (new RegExp(rx, 'i')).test(tabUrl));
            if (matchingRegex) {
                console.debug(`URL of Tab ${tabId} of Window ${windowId} matches regex ${new RegExp(matchingRegex, 'i')} of ${orgName}`);
                matchingOrgName = orgName;
                break;
            }
        }

        if (matchingOrgName) {
            chrome.notifications.create(`${NOTIFICATION_ID_PREFIX}${matchingOrgName}`, {
                type: 'basic',
                iconUrl: 'images/icon-128.png',
                title: "Don't cross the virtual picket line!",
                message: `Employees who work for ${matchingOrgName} are on strike! Click on this notification for more information.`,
                priority: 2,
                requireInteraction: true
            }, notificationId => {
                console.debug(`created Notification '${notificationId}' from Tab ${tabId} of Window ${windowId}`);
            });
        }
    });
};

chrome.tabs.onActivated.addListener(async activeInfo => {
    const {tabId, windowId} = activeInfo;

    console.debug(`user switched to Tab ${tabId} of Window ${windowId}`);

    await checkTab(tabId, windowId);
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (!changeInfo.url) {
        return;
    }

    const windowId = tab.windowId;

    console.debug(`user updated URL of Tab ${tabId} of Window ${windowId}`);

    await checkTab(tabId, windowId);
});

chrome.notifications.onClicked.addListener(async notificationId => {
    console.debug(`Notification '${notificationId}': user clicked on me`);

    const orgName = notificationId.split('-')[1];

    const strikesByOrgName = await loadStrikeData();
    const strike = strikesByOrgName[orgName];

    chrome.tabs.create({
        url: strike.moreInfoUrl
    }, tab => {
        console.debug(`Notification '${notificationId}': created new tab for ${tab.url}`);
    });
});
