const NOTIFICATION_ID_PREFIX = 'strike-';
const STRIKES_CACHE_TIME = 60;  // in minutes
const STRIKES_STORAGE_KEY = 'strikes';
const STRIKES_TIMESTAMP_STORAGE_KEY = 'strikes-timestamp';

const DEBUG_LOAD_STRIKES_LOCALLY = false;

const loadStrikeData = async () => {
    let strikeData;

    if (DEBUG_LOAD_STRIKES_LOCALLY) {
        strikeData = JSON.parse(await (await fetch("data/strikes.json", {cache: 'no-cache'})).text());

        console.debug("Loaded strike data locally", strikeData);
    } else {
        const strikesTimestamp = await new Promise(resolve => {
            chrome.storage.local.get(STRIKES_TIMESTAMP_STORAGE_KEY, items => {
                if (!items || !items[STRIKES_TIMESTAMP_STORAGE_KEY]) {
                    resolve(null);
                } else {
                    resolve(items[STRIKES_TIMESTAMP_STORAGE_KEY]);
                }
            });
        });

        if (strikesTimestamp && (Math.round((Date.now() - strikesTimestamp) / 1000 / 60) <= STRIKES_CACHE_TIME)) {
            // data from app cache is still fresh,
            // so fetch it without subsequently updating it

            strikeData = await new Promise(resolve => {
                chrome.storage.local.get(STRIKES_STORAGE_KEY, items => {
                    if (!items || !items[STRIKES_STORAGE_KEY]) {
                        console.error(`No strike data in app cache, but strike timestamp is present: ${strikesTimestamp}`);
                        resolve(null);
                    } else {
                        resolve(items[STRIKES_STORAGE_KEY]);
                    }
                });
            });

            console.debug(`Loaded strike data from app cache; it's ~${Math.round((Date.now() - strikesTimestamp) / 1000 / 60)} minute(s) old`, strikeData);
        } else {
            // there's nothing in the app cache or what's in there is stale,
            // so make a network request to get fresher data

            try {
                strikeData = JSON.parse(await (await fetch("https://raw.githubusercontent.com/jamespizzurro/picket-line-notifier/main/data/strikes.json", {cache: 'no-cache'})).text());
            } catch (e) {
                console.warn("Failed to fetch strike data from raw.githubusercontent.com! Falling back to using GitCDN...", e);

                try {
                    strikeData = JSON.parse(await (await fetch("https://gitcdn.link/cdn/jamespizzurro/picket-line-notifier/main/data/strikes.json", {cache: 'no-cache'})).text());
                } catch (e) {
                    console.warn("Failed to fetch strike data from GitCDN! Falling back to using jsDelivr...", e);

                    try {
                        strikeData = JSON.parse(await (await fetch("https://cdn.jsdelivr.net/gh/jamespizzurro/picket-line-notifier@main/data/strikes.json", {cache: 'no-cache'})).text());
                    } catch (e) {
                        console.error("Failed to fetch strike data from jsDelivr!", e);
                    }
                }
            }

            console.debug("Loaded strike data from network", strikeData);

            // update app cache with fresher data
            await new Promise(resolve => {
                const data = {};
                data[STRIKES_TIMESTAMP_STORAGE_KEY] = Date.now();
                data[STRIKES_STORAGE_KEY] = strikeData;

                chrome.storage.local.set(data, () => {
                    resolve();
                });

                console.debug("App cache updated", data);
            });
        }
    }

    return strikeData;
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

        const currentDate = new Date();
        const strikesByOrgName = await loadStrikeData();
        for (const [orgName, strike] of Object.entries(strikesByOrgName)) {
            if (strike.startTime) {
                const startTimeDate = Date.parse(strike.startTime);
                if (currentDate < startTimeDate) {
                    // bail; start time hasn't occurred yet
                    continue;
                }
            }

            if (strike.endTime) {
                const endTimeDate = Date.parse(strike.endTime);
                if (endTimeDate <= currentDate) {
                    // bail; end time has already occurred or is occurring
                    continue;
                }
            }

            const matchingRegex = strike.matchingUrlRegexes.find(rx => (new RegExp(rx, 'i')).test(tabUrl));
            if (matchingRegex) {
                console.debug(`URL of Tab ${tabId} of Window ${windowId} matches regex ${new RegExp(matchingRegex, 'i')} for ${orgName}`);

                const badgeText = "!";
                chrome.browserAction.setBadgeText({
                    tabId: tabId,
                    text: badgeText
                }, () => {
                    console.debug(`set badge text for Tab ${tabId} to "${badgeText}"`);
                });

                createNotification(orgName, tabId, windowId);

                break;
            }
        }
    });
};

chrome.runtime.onInstalled.addListener(async () => {
    // when the extension is first installed or updated,
    // make a fetch for strike data to populate our popup with strikes,
    // otherwise users could open our popup immediately after installing the extension (i.e. without changing tabs first) and see no strikes listed
    await loadStrikeData();
});

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
        console.debug(`Notification '${notificationId}': created new tab (Tab ${tab.id}) for ${orgName} to ${strike.moreInfoUrl}`);
    });
});
