# Import Local Assets

A Tampermonkey script to load local assets into staged documents.

## 1. Install TamperMonkey extention in your browser

Available [TamperMonkey](https://www.tampermonkey.net/) extentions:
- [For Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
- [For Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en)
- [For Microsoft Edge](https://www.microsoft.com/en-us/p/tampermonkey/9nblggh5162s?activetab=pivot:overviewtab)
- [For Safari](https://apps.apple.com/us/app/tampermonkey/id1482490089?mt=12)

## 2. Configure the script

Download the example "[tampermonkey.js](https://raw.githubusercontent.com/WoollyMittens/tampermonkey-quick-refresh/master/tampermonkey.js)" script from [this repository](https://github.com/WoollyMittens/tampermonkey-quick-refresh).

### Fill in the project information

In the top of the file edit the @name of your project and @match the domain of the site the script should affect.

```javascript
// ==UserScript==
// @name         Local Assets
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  Cache-bust all the things
// @author       maurice.vancreij@webqem.com
// @include      *://www.domain.tld*
// @grant        GM_xmlhttpRequest
// @connect      localhost
// ==/UserScript==
```

In this case the following domain would be affected: www.domain.tld

### Fill in the local path

Configure the local assets in the following way:

```javascript
  { url: 'http://localhost/path/to/styles.css', target: 'body' },
  { url: 'http://localhost/path/to/component.html', target: '#main' }
```

**url : {String}** - The local HTML or CSS asset to insert.

**target : {String}** - The target container in the document.

## Aditional functionality

Pressing ```~``` will reload the assets without refreshing the page.
