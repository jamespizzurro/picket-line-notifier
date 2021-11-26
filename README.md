# Picket Line Notifier

A browser extension that alerts you when you navigate to a website belonging to an organization whose employees are on strike. You can then click on the notification to learn more about the strike.

## Installing

### Google Chrome / Microsoft Edge

1. Download this repository as a [ZIP file from GitHub](https://github.com/jamespizzurro/picket-line-notifier/archive/refs/heads/main.zip).
2. Unzip the ZIP file and you should have a directory named `picket-line-notifier-main`. Move this directory to a permanent location, as deleting it will uninstall the extension.
3. Launch your web browser and go to its Extensions page (<a href="chrome://extensions">chrome://extensions</a> for Chrome; <a href="edge://extensions">edge://extensions</a> for Edge). Enable 'Developer Mode' from there.
4. Drag the `picket-line-notifier-main` directory anywhere on the page to import it. Remember: don't delete the `picket-line-notifier-main` directory unless you want to uninstall the extension.

### Mozilla Firefox

1. Download [the latest XPI file from GitHub](https://github.com/jamespizzurro/picket-line-notifier/raw/main/web-ext-artifacts/picket_line_notifier-0.1.0-an%2Bfx.xpi).
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

### Third-party

* All in-browser icons made by <a href="https://www.flaticon.com/authors/chanut-is-industries" title="Chanut-is-Industries">Chanut-is-Industries</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
