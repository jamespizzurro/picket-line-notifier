# Picket Line Notifier

A browser extension that alerts you when you navigate to a website belonging to an organization whose employees are on strike. You can then click on the notification to learn more about the strike.

<img src="https://github.com/jamespizzurro/picket-line-notifier/raw/main/screenshots/chrome-notification.png" alt="A screenshot of wirecutter.com with a notification from this browser extension rendered over it indicating that Wirecutter's employees are on strike and that one can click the notification for more information.">

## Installing

If available for your browser, we recommend installing this browser extension [automatically](#automatically) to ensure you receive any updates to the extension itself. Regardless of what browser or installation method you choose though, after installing the browser extension for the first time, you'll get [the latest strike data](https://github.com/jamespizzurro/picket-line-notifier/blob/main/data/strikes.json) automatically thereafter.

### Automatically

#### Google Chrome

This browser extension is not yet available from [Google's Chrome Web Store](https://chrome.google.com/webstore/category/extensions); official approval for it to be listed there is still pending. In the meantime, please use [the manual installation instructions for Google Chrome](#google-chrome--microsoft-edge) below.

#### Microsoft Edge

This browser extension is not yet available from [Microsoft's Edge Add-ons page](https://microsoftedge.microsoft.com/addons/Microsoft-Edge-Extensions-Home); official approval for it to be listed there is still pending. In the meantime, please use [the manual installation instructions for Microsoft Edge](#google-chrome--microsoft-edge) below.

#### Mozilla Firefox

Download from [our page on Mozilla's listing of Firefox add-ons](https://addons.mozilla.org/en-US/firefox/addon/picket-line-notifier/).

### Manually

#### Google Chrome / Microsoft Edge

1. Download this repository as a [ZIP file from GitHub](https://github.com/jamespizzurro/picket-line-notifier/archive/refs/heads/main.zip).
2. Unzip the ZIP file and you should have a directory named `picket-line-notifier-main`. Move this directory to a permanent location, as deleting it will uninstall the extension.
3. Launch your web browser and go to its Extensions page (<a href="chrome://extensions">chrome://extensions</a> for Chrome; <a href="edge://extensions">edge://extensions</a> for Edge). Enable 'Developer Mode' from there.
4. Drag the `picket-line-notifier-main` directory anywhere on the page to import it. Remember: don't delete the `picket-line-notifier-main` directory unless you want to uninstall the extension.

#### Mozilla Firefox

1. Download [the latest XPI file from GitHub](https://github.com/jamespizzurro/picket-line-notifier/raw/main/web-ext-artifacts/picket_line_notifier-1.0.3-an+fx.xpi) in the `web-ext-artifacts` directory of this repository.
2. Launch Firefox, go to Settings > Extensions & Themes > Extensions (<a href="about:addons">about:addons</a>), click the button with a gear icon, and choose 'Install Add-on From File...' from the menu that appears. Find the XPI file you just downloaded from the file chooser dialog that appears, select it and continue.
3. Optional: delete the XPI file you downloaded; it's no longer necessary.

## Contributing

Check out the `data/strikes.json` file. If you notice a strike is missing from that file, or the data for a given strike listed there isn't as good as it could be, or a strike that's no longer active is still listed, create a new issue or submit a pull request to this repository.

For reference, here's an example of what an entry in `data/strikes.json` should look like:

```json
"Wirecutter": {
    "moreInfoUrl": "https://twitter.com/wirecutterunion/status/1463734222812856321",
    "matchingUrlRegexes": [
        "wirecutter.com",
        "nytimes.com\/wirecutter"
    ]
}
```

In the example above, "Wirecutter" is the organization name, `matchingUrlRegexes` is the list of (case-insensitive) regular expressions that match on Wirecutter's websites that create a browser notification alerting the user to the strike, and `moreInfoUrl` is the URL that the user should be navigated to when they click on that browser norification to learn more about it. For `moreInfoUrl`, primary sources are preferred, i.e. a link to the employee union's official tweet about it, as opposed to a news story.

## Credits

### Frequently Used Data Sources

* [AFL-CIO's Strike Map](https://aflcio.org/strike-map)
* [The Cornell-ILR Labor Action Tracker](https://striketracker.ilr.cornell.edu/)

### Graphics

* All in-browser icons made by <a href="https://www.flaticon.com/authors/chanut-is-industries" title="Chanut-is-Industries">Chanut-is-Industries</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
