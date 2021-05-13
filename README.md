# WP GlotPress Tools
This is a Chrome/Edge extension to help you translate faster. 

## #1 Consistency Tools - [view Demo](https://youtu.be/Ve9DSOfFBeA) 

<img align="right" src="https://user-images.githubusercontent.com/65488419/117619811-61cdc800-b178-11eb-8754-88d03ca00c09.png">

**Search** a string in:
- current project, current locale
- WordPress development project, current locale
- consistency tool, current locale
- a plugin of your choice

<img align="right" src="https://user-images.githubusercontent.com/65488419/117620318-11a33580-b179-11eb-9968-f1148d58686c.png" >

**Quick links**: copy URL or open in new tab
- Permalink
- History
- Consistency

<img align="right" src="https://user-images.githubusercontent.com/65488419/117621284-203e1c80-b17a-11eb-8a86-26c34f17f1b3.png" >

**GoogleTranslate** button 
- new tab with current translated string in current locale

<img align="right" src="https://user-images.githubusercontent.com/65488419/117621916-c1c56e00-b17a-11eb-9cab-a593532a8e05.png" >

**Suggestions** directly from Consistency
 - Translation Memory sometimes has bad translations (see [#meta5340](https://meta.trac.wordpress.org/ticket/5340))
 - This shows Consistency translations directly in the editor panel

<img align="right" src="https://user-images.githubusercontent.com/65488419/117623006-eec65080-b17b-11eb-94b9-18ec705ed359.png" >
<br>

- To copy 2nd suggestion, click on it or press Alt + 2
- Keyboard shortcut works for suggestion 1, 2 and 3

## #2 General Checks - [view Demo](https://youtu.be/pG92jygfWpY) 
![image](https://user-images.githubusercontent.com/65488419/117623706-c9861200-b17c-11eb-99d6-614d9ab41f91.png)

<img align="right" src="https://user-images.githubusercontent.com/65488419/117624878-14ecf000-b17e-11eb-8b34-c9410e226469.png" >

Checks run:
- for all translated strings when page loads
- before a translation is submitted

<br>

Checks can be set as:
- Warning & prevent save
- Just notification
- Don't check
<img align="right" src="https://user-images.githubusercontent.com/65488419/117626608-f4be3080-b17f-11eb-91a7-fefd621df320.png" >

<br>


- To bypass a *Warning & prevent save* check, click Save / approve with warnings
- Show only strings with failed checks using
  ![image](https://user-images.githubusercontent.com/65488419/117627508-e7ee0c80-b180-11eb-93e2-8c17c27f5bdf.png)

## #3 Locale specific Checks

Currently, it only has Romanian checks, but additional locale specific checks can be added. These work the same way as general checks.
![image](https://user-images.githubusercontent.com/65488419/117628526-f0931280-b181-11eb-942e-7a611bb70e39.png)

## #4 Custom Keyboard Shortcuts

| Action | Shortcut | Alternative Shortcut |
| --- | --- | ---|
| **F**uzzy | Ctrl + \* (numeric keyboard) | Ctrl + Shift + **F** | 
| **G**oogle Translate | Alt + **G** | 
| **C**onsistency | Alt + **C** | 
| Copy consistency #**3** | Alt + **3** | *works for 1-3* |
| Focus on **S**earch in **P**rojects | Alt + **S** | Alt + **P** (since v.1.3 for Firefox) |

### Other features
- Keeps the editor in the middle of the screen when Page Up/Page Down shortcuts are used

### Future version features

- Personal translation notes & project status snippets
- Alert for unsaved string (v.1.2 has such a feature included but it is disabled because it has flaws)
- ~~Personal glossary~~ (this is included in [WPTranslationFiller extension](https://github.com/vibgyj/WPTranslationFiller/) and I don't plan to overlap features)
- ~~A Firefox version or a TamperMonkey script~~ (available for testing [here](https://github.com/vlad-timotei/wpgp-tools/blob/main/userscript/wpgpt-userscript-main-latest.js))
 
### Installation
Only choose one of these two:

##### Google Chrome & Edge

1. Get the latest release from [here](https://github.com/vlad-timotei/wpgp-tools/releases/latest) and extract to a folder.
2. Open Chrome extensions `chrome://extensions/` or `edge://extensions/` and enable Developer mode.
3. Then use Load Unpacked button and point to the `wpgp-tools\src\` folder
4. That's it! Go to a translate project to see it in action.

##### Firefox and other browsers via Tampermonkey or Greasemonkey

1. Install the [Tampermonkey](http://tampermonkey.net/) or [Greasemonkey](http://www.greasespot.net/) browser extensions.
2. Visit [this page](https://raw.githubusercontent.com/vlad-timotei/wpgp-tools/main/userscript/wpgpt-userscript-main-latest.js). TamperMonkey or GreaseMonkey should take over from there. I don't know why Tampermonkey doesn't automatically prompt to install this particular script.
**If that is the case, either:**
* manually copy the URL and install it in the Utilities > Install from URL 
* OR manually copy the script, click the + button and install it.

<img align="right" src="https://user-images.githubusercontent.com/65488419/118153870-0a04ba80-b41f-11eb-9e96-bfb9dc405247.png">

- The first time you use Search in multiple projects feature, the browser will prevent opening multiple tabs. 
- Click on Options > Allow pop-ups for translate.wordpress.org and this will work properly in the future.


### Known issues
- It's an unpacked extension
- Doesn't display Close all btn when Quick Links are fired & throws error if attempts to close a manually closed tab (future release will fix it)
- The repo doesn't use workflows to build the release additional zip - I couldn't make it work - if anyone has some hints, let me know.
- Tooltips overlap for the Quick Links section (should be fixed upstream)
- Doesn't work on mobile (needs .touch() event listeners)

### Contributing
Contributions are welcome, bugreports, suggestions and even pull requests! No limitations, shoot for the stars!

### Changelog
##### v.1.0
- Consistency
  * Search in projects
  * Quick links
  * Google Translate
  * Consistency suggestions
- Checks
  * General checks
  * Romanian checks
- Others
  * Custom Shortcuts

##### v.1.1
- Consistency data fetching performance 

##### v.1.2
- Don't promt to "update" to an older version
