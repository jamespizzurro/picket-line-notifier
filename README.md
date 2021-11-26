# Picket Line Notifier

A browser extension that notifies you when you navigate to a website belonging to an organization whose employees are on strike.

## Installing

### Google Chrome / Microsoft Edge

1. Download this repository as a [ZIP file from GitHub](https://github.com/jamespizzurro/picket-line-notifier/archive/refs/heads/main.zip).
2. Unzip the ZIP file and you should have a directory named `picket-line-notifier-master`. Move this directory to a permanent location, as deleting it will uninstall the extension.
3. Launch your web browser and go to its Extensions page (<a href="chrome://extensions">chrome://extensions</a> for Chrome; <a href="edge://extensions">edge://extensions</a> for Edge). Enable 'Developer Mode' from there.
4. Drag the `picket-line-notifier-master` directory anywhere on the page to import it. Remember: don't delete the `picket-line-notifier-master` directory unless you want to uninstall the extension.

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

In the example above, "Wirecutter" is the organization name, `matchingUrls` is the list of (case-insensitive) regular expressions that match on Wirecutter's websites that create a browser notification alerting the user to the strike, and `moreInfoUrl` is the URL that the user should be navigated to when they click on that browser norification to learn more about it. For `moreInfoUrl`, primary sources are preferred, i.e. a link to the employee union's official tweet about it, as opposed to a news story.

## Credits

### Third-party

* All in-browser icons made by <a href="https://www.flaticon.com/authors/chanut-is-industries" title="Chanut-is-Industries"> Chanut-is-Industries </a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
