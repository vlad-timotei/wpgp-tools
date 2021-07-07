
# WP GlotPress Tools
<img align="right" src="https://user-images.githubusercontent.com/65488419/118821977-6a34aa00-b8c0-11eb-9e1e-9304db38c434.png">


This is a Chrome/Edge/Opera/UserScript extension to help you translate faster. 


You can find the **Settings** for this extension in the top blue navigation menu *Tools Settings*


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
- Button or Alt + G opens new tab with current translated string in current locale, if locale exists on GT. ([List of missing locales in GT](https://gist.github.com/vlad-timotei/3f558547ac2bc0f3120f869fba7d8bec))

<img align="right" src="https://user-images.githubusercontent.com/65488419/117621916-c1c56e00-b17a-11eb-9cab-a593532a8e05.png" >

**Suggestions** directly from Consistency
 - Button or Alt + C
 - Translation Memory sometimes has bad translations (see [#meta5340](https://meta.trac.wordpress.org/ticket/5340))
 - This shows Consistency translations directly in the editor panel

<img align="right" src="https://user-images.githubusercontent.com/65488419/117623006-eec65080-b17b-11eb-94b9-18ec705ed359.png" >
<br>

- Button or Alt + 2 to copy 2nd suggestion, 
- Keyboard shortcut works for suggestion 1, 2 and 3

## #2 General Checks - [view Demo](https://youtu.be/pG92jygfWpY) 
![image](https://user-images.githubusercontent.com/65488419/119303368-4978a580-bc6e-11eb-8897-271404a6ce53.png)

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
- Show only strings with failed checks using filters

![image](https://user-images.githubusercontent.com/65488419/121800720-26715e00-cc3c-11eb-8b29-6e63f5db5b13.png)

## #3 Locale specific Checks

If your locale uses a different symbol other than `.` for period, you can set it here.
Additional specific locale checks can be added if requested. These work the same way as general checks.
Please open an issue with the checks you'd like implemented for your locale and I'll try to make it happen.

![image](https://user-images.githubusercontent.com/65488419/119268770-1a761b80-bbfd-11eb-96ed-037e1c54ba1d.png)

## #4 Custom Keyboard Shortcuts

| Action | Shortcut | Alternative Shortcut |
| --- | --- | ---|
| **F**uzzy | Ctrl + \* (numeric keyboard) | Ctrl + Shift + **F** | 
| **G**oogle Translate | Alt + **G** | 
| **C**onsistency | Alt + **C** | 
| Copy consistency #**3** | Alt + **3** | *works for 1-3* |
| Focus on **S**earch in **P**rojects | Alt + **S** | Alt + **P**|

### Other features
- Keeps the editor in the middle of the screen when Page Up/Page Down shortcuts are used
- Prompts for unsaved strings

### Installation
Only choose one of these two:

##### Google Chrome, Edge & Opera

1. Get the latest release from [here](https://github.com/vlad-timotei/wpgp-tools/releases/latest) and extract to a folder.
2. Open Chrome extensions `chrome://extensions/` or `edge://extensions/` or `opera://extensions/` and enable Developer mode.
3. Then use Load Unpacked button and point to the `wpgp-tools\src\` folder
4. That's it! Go to a translate project to see it in action.

##### Firefox and other browsers via Tampermonkey

1. Install the [Tampermonkey](http://tampermonkey.net/) browser extensions.
2. Visit [this page](https://github.com/vlad-timotei/wpgp-tools/raw/main/userscript/wpgpt-userscript-latest.user.js). TamperMonkey should take over from there and prompt to install the userscript.
If this somehow fails, you can: manually copy the URL and install it in the Utilities > Install from URL or manually copy the script, click the + button and install it.

<img align="right" src="https://user-images.githubusercontent.com/65488419/118153870-0a04ba80-b41f-11eb-9e96-bfb9dc405247.png">

- The first time you use Search in multiple projects feature, the browser will prevent opening multiple tabs. 
- Click on Options > Allow pop-ups for translate.wordpress.org and this will work properly in the future.


### Known issues
- Tooltips overlap for the Quick Links section (should be fixed upstream)
- After Save/Aprove/Reject/Fuzzy the scripts don't reload for that row
- It's an unpacked extension and the repo doesn't use workflows to build the release additional zip

### Future version features

- Personal translation notes & project status snippets
- ~~Personal glossary~~ (this is included in [WPTranslationFiller extension](https://github.com/vibgyj/WPTranslationFiller/) and [GlotDict](https://github.com/Mte90/GlotDict) and I don't plan to overlap features!)
- Gradually, some WPGPT features will be implemented in GlotDict, as part of a cross-project initiative. That said, WPGPT will continue to exist for those interested


### Contributing
Contributions are welcome, bugreports, suggestions and even pull requests! No limitations, shoot for the stars!

### [Changelog](/CHANGELOG.md)
