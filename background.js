const NOTIFICATION_ID_PREFIX = 'strike-';

const loadStrikeData = async () => {
    return JSON.parse(await (await fetch('https://gitcdn.link/cdn/jamespizzurro/picket-line-notifier/main/data/strikes.json')).text());
};

const createNotification = (orgName, tabId, windowId) => {
    // only create a notification if one doesn't already exist for a given organization

    chrome.notifications.getAll(notifications => {
        const notificationId = `${NOTIFICATION_ID_PREFIX}${orgName}`;
        const notificationOptions = notifications[notificationId];
        if (!notificationOptions) {
            chrome.notifications.create(notificationId, {
                type: 'basic',
                iconUrl: 'images/icon-128.png',
                title: "Don't cross the virtual picket line!",
                message: `Employees who work for ${orgName} are on strike! Click on this notification for more information.`,
                priority: 2
            }, notificationId => {
                console.debug(`created Notification '${notificationId}' for ${orgName} from Tab ${tabId} of Window ${windowId}`);
            });
        }
    });
};

const checkTab = async (tabId, windowId) => {
    chrome.tabs.query({
        active: true,
        lastFocusedWindow: true
    }, async tabs => {
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

        const strikesByOrgName = await loadStrikeData();
        for (const [orgName, strike] of Object.entries(strikesByOrgName)) {
            const matchingRegex = strike.matchingUrlRegexes.find(rx => (new RegExp(rx, 'i')).test(tabUrl));
            if (matchingRegex) {
                console.debug(`URL of Tab ${tabId} of Window ${windowId} matches regex ${new RegExp(matchingRegex, 'i')} for ${orgName}`);
                createNotification(orgName, tabId, windowId);
                break;
            }
        }
    });
};

chrome.tabs.onActivated.addListener(async activeInfo => {
    const {tabId, windowId} = activeInfo;

    console.debug(`Tab ${tabId} of Window ${windowId}: user switched to me`);

    await checkTab(tabId, windowId);
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (!changeInfo.url) {
        return;
    }

    const windowId = tab.windowId;

    console.debug(`Tab ${tabId} of Window ${windowId}: URL updated`);

    await checkTab(tabId, windowId);
});

chrome.notifications.onClicked.addListener(async notificationId => {
    console.debug(`Notification '${notificationId}': user clicked me`);

    const orgName = notificationId.split('-')[1];

    const strikesByOrgName = await loadStrikeData();
    const strike = strikesByOrgName[orgName];
    if (!strike) {
        return;
    }

    chrome.tabs.create({
        url: strike.moreInfoUrl
    }, tab => {
        console.debug(`Notification '${notificationId}': created new tab for ${orgName} to ${strike.moreInfoUrl}`);
    });
});
