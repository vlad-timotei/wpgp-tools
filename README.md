
# WPGPTools - Translate faster and better

<img align="right" src="https://user-images.githubusercontent.com/65488419/124776835-6defbf00-df48-11eb-9594-c538fe220dbd.png">

Adjust the **Settings** for this extension in the top blue navigation menu *Tools Settings*

## #1 Consistency Tools 
[Watch a demo video for Consistency Tool features.](https://youtu.be/k686EedCSSs)

<img align="right" src="https://user-images.githubusercontent.com/65488419/117620318-11a33580-b179-11eb-9968-f1148d58686c.png">

**Quick links**: copy URL or open in new tab
- Permalink
- History
- Consistency

<img align="right" src="https://user-images.githubusercontent.com/65488419/117619811-61cdc800-b178-11eb-8754-88d03ca00c09.png">

**Search** a string in:
- current project, current locale
- WordPress development project, current locale
- consistency tool, current locale
- a plugin of your choice

<img align="right" src="https://user-images.githubusercontent.com/65488419/125750657-bf694aa2-f816-41ef-bebe-a8fd78715b74.png">

**Suggestions** directly from Consistency
 - Button or Alt + C
 - Translation Memory sometimes has bad translations (see [#meta5340](https://meta.trac.wordpress.org/ticket/5340))
 - This shows Consistency translations directly in the editor panel
 - Button or Alt + 2 to copy 2nd suggestion, 
 - Keyboard shortcut works for suggestion 1, 2 and 3

**GoogleTranslate** button 
- Button or Alt + G opens new tab with current translated string in current locale, if locale exists on GT. ([missing locales in GT](https://gist.github.com/vlad-timotei/3f558547ac2bc0f3120f869fba7d8bec))

## #2 General Checks 
[Watch a demo video for Checks feature.](https://youtu.be/R4M_TBSRWSE)

These checks run for all translated strings when page loads and when a translation is submitted. <br> Checks can be set as: Warning & prevent save, Just notification or Don't check.


**Notices and labels** for checks results

![image](https://user-images.githubusercontent.com/65488419/125183339-84369d00-e21e-11eb-9d29-e78be7fe508e.png)

**Highlights** double spaces and user defined "bad words" *(eg. below: link)*

![image](https://user-images.githubusercontent.com/65488419/125183284-f8bd0c00-e21d-11eb-9e80-f9608f8eaab5.png) <br>

<img align="right" width="550" src="https://user-images.githubusercontent.com/65488419/117626608-f4be3080-b17f-11eb-91a7-fefd621df320.png" >

<br>

<br>

<br>

<br>

<br>

To bypass warnings, click <br> Save / Approve with warnings

<br>

<br>


Personalize checks as you see fit:

![image](https://user-images.githubusercontent.com/65488419/125194373-b4e7f800-e259-11eb-8432-6bbcbbfefd2c.png)

**Prevent saving these words** is a user defined list of words that if found in a translation will generate a warning. Separated by comma, no space, case insensitive.

**Count and match these** is a user defined list of terms or symbols that will be counted both in original and in translation. If counts don't match, a warning will be generated. Separated by comma, no space, case insensitive.

Filter strings based on warnings (count is accurate only on first page load): <br>
![image](https://user-images.githubusercontent.com/65488419/121800720-26715e00-cc3c-11eb-8b29-6e63f5db5b13.png)<br>

## #3 Locale specific Checks

If your locale uses a different symbol other than `.` for period, you can set it here. Additional specific locale checks can be added if requested in an issue.

![image](https://user-images.githubusercontent.com/65488419/119268770-1a761b80-bbfd-11eb-96ed-037e1c54ba1d.png)

## #4 History Tools
[Watch a demo video for Checks feature.](https://youtu.be/ZKfqKD-ZIYE)

These are **opt-in** tools, so go to Settings > History Tools and enable them if you want to use them. 

<image align="right" src="https://user-images.githubusercontent.com/65488419/124787689-5c5ee500-df51-11eb-97d6-8f89b5fca581.png">
<br>

<br>

**I. History Compare** compares the string with a corresponding string from History

<br>

| String status | Compared with |
| --- | --- |
| Old | Current |
| Rejected | Current |
| Waiting | Current |
| Fuzzy | Waiting |

 <br>
 

 <br>

It adds preview and editor label and a diff highlighter in editor.
 
 <br>

 <br>

 <br>
 
 <img align="right" src="https://user-images.githubusercontent.com/65488419/124783181-8c0bee00-df4d-11eb-88d7-9ad0598f4455.png">
 <br>

 <br>
 
**II. History Count** counts (regardless of string status) types of strings in History for the respective string; doesn't count itself.

 
**III. History Tools in Translation History** enables or disables these tools on History pages opened trough a link.
 
 <br>
 
## #5 Custom Keyboard Shortcuts

| Action | Shortcut | Alternative Shortcut |
| --- | --- | --- |
| **F**uzzy | Ctrl + \* (numeric keyboard) | Ctrl + Shift + **F**  | 
| **C**onsistency | Alt + **C** | 
| Copy consistency #**3** | Alt + **3** | *works for 1-3* |
| **G**oogle Translate | Alt + **G** | 
| Focus on **S**earch in **P**rojects  |   Alt + **S**  |  Alt + **P** |

## #6 Other features
- Keeps the editor in the middle of the screen when Page Up/Page Down shortcuts are used
- Prompts for unsaved strings

## Installation
Only choose one of these two:

### Google Chrome, Edge & Opera

1. Get the latest release from [here](https://github.com/vlad-timotei/wpgp-tools/releases/latest) and extract to a folder.
2. Open Chrome extensions `chrome://extensions/` or `edge://extensions/` or `opera://extensions/` and enable Developer mode.
3. Then use Load Unpacked button and point to the `wpgp-tools\src\` folder
4. That's it! Go to a translate project to see it in action.

### Firefox and other browsers via Tampermonkey

1. Install the [Tampermonkey](http://tampermonkey.net/) browser extensions.
2. Visit [this page](https://github.com/vlad-timotei/wpgp-tools/raw/main/userscript/wpgpt-userscript-latest.user.js). TamperMonkey should take over from there and prompt to install the userscript.
If this somehow fails, you can: manually copy the URL and install it in the Utilities > Install from URL or manually copy the script, click the + button and install it.

<img align="right" src="https://user-images.githubusercontent.com/65488419/118153870-0a04ba80-b41f-11eb-9e96-bfb9dc405247.png">

- The first time you use Search in multiple projects feature, the browser will prevent opening multiple tabs. 
- Click on Options > Allow pop-ups for translate.wordpress.org and this will work properly in the future.


## Known issues
- Tooltips overlap for the Quick Links section (should be fixed upstream)
- It's an unpacked extension and the repo doesn't use workflows to build the release additional zip

## Future version features

- Personal translation notes & project status snippets
- ~~Personal glossary~~ (this is included in [WPTranslationFiller extension](https://github.com/vibgyj/WPTranslationFiller/) and [GlotDict](https://github.com/Mte90/GlotDict) and I don't plan to overlap features!)
- Gradually, some WPGPT features will be implemented in GlotDict, as part of a cross-project initiative. That said, WPGPT will continue to exist for those interested.
- When a feature will be included in GlotPress (the long term plan for as many features as possible) it will be excluded from this extension.


### [Changelog](/CHANGELOG.md)

### [Documentation](https://github.com/vlad-timotei/wpgp-tools/wiki)

### Contributions
Contributions are welcome, bugreports, suggestions and even pull requests! No limitations, shoot for the stars!
