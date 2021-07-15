# v.1.0 - 11.05.2021
  * Search in projects
  * Quick links
  * Google Translate
  * Consistency suggestions
  * General checks
  * Romanian checks
  * Custom Shortcuts

# v.1.1 - 12.05.2021
* Consistency data fetching performance 

# v.1.2 - 12.05.2021
* Don't promt to "update" to an older version

# v.1.3 - 23.06.2021
* Adds end `?` check
* Adds **custom period** check
* Adds `Alt + P` shortcut (Firefox users need it)
* Adds prompt for unsaved strings when leaving the page
* Improves last character check ([see issue](https://github.com/vlad-timotei/wpgp-tools/issues/1#issuecomment-843997677))
* Improves design: filters, icons, logo, extension settings page 
* Improves checks performance by **+15%** and improves results messages
* Fixes additional `/` in QuickLinks
* Fixes *Save with warnings* UI inconsistency
* Fixes GT encodeURIComponent
* Fixes GT link for locales with a different slug than the one on GP
* Obsoletes fallback different ending result (now redundant)

# v.1.4 - 20.07.2021
* Adds: History Count
* Adds: Consistency count
* Adds: Check Results Labels
* Adds: Count and Match option
* Adds: String History with Diff
* Adds: Check for missing end `!`
* Adds: Highlights for some warnings
* Change: GT button in the suggestions area
* Fixes: Enables Quick Links on result pages
* Fixes: Shows warning for an empty translation
* Fixes: Enables warnings list to non PTE/GTE users
* Fixes: Reloads the checks after Save/Aprove/Reject
* Obsoletes: Additional or missing end space (merged)
* Obsoletes: Notify about these words user option from UI
* Improves: Some regex replaced with a more performant function
* Improves: Features implement more design accesibility standards
* Performance: Removes duplicate jQuery library from content_scripts
* Performance: Similar loading time with considerably increased features