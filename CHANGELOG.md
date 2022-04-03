# 2.0.1
- Enhancement: check for multiple current translations
- Enhancement: don't throw a warning for period as separator
- Enhancement: use Manifest v3
- Enhancement: clarify Settings title
- Enhancement: allow bulk replacement for context edgecases
- Compatibility: GP 3.0
- Announcement: For a better unified experience, features merged in GD will soon become unavailable in WPGPT.

# 2.0.0
31.01.2022
- Enhancement: allow all custom shortcuts to be disabled
- Enhancement: check for additional or missing end tabs 
- Enhancement: check for correct tags spaces
- Enhancement: deep GlotDict compatibility
- Enhancement: optimized performance and UI

# 1.9.1
12.10.2021
- Fix: various compatibility edge cases
- Enhancement: re-add tools after saving the string

# 1.9
11.10.2021
- Feature - Setting: Also using GlotDict? (Default is Yes.)
- Enhancement: Keep Translation Memory suggesitons first
- Enhancement: Only notice for missing double spaces
- Enhancement: code optimization

# 1.8.5
06.10.2021
- Enhancement: Autoload consistency suggestions on editor open, as other suggestions
- Enhancement: Display ⟵ next to the current consistency suggestion
- Enhancement: Alt + C shortcut loads all consistency suggestions
- Enhancement: Warn GTEs about multiple consistency alternatives
- Enhancement: Refine placeholders count for nplural === 1
- Enhancement: Adjust labels for multiple waiting strings
- Enhancement: Shift + Ctrl + Enter - save with warnings
- Enhancement: Allow search in multiple plugins
- Fix: Word-break non-translatable items
- Fix: Replace some deprecated methods
- Performance: Full Code refactory

# 1.7
13.09.2021
- Enhancement: Highlight spaces in original
- Enhancement: Romanian single quotes check
- Enhancement: Better Filters position
- Event: Chrome Web Store publication
- Compatibility with GlotDict 2.0

# 1.6
01.09.2021
- Feature: Non-translatables: highlight, click, insert buttons, copy all
- Feature: Highlight spaces in Consistency Suggestions
- Feature: Plurals in Consistency Suggestions
- Feature: Bulk Consistency Tools for GTEs
- Enhancement: Consistency suggestion shortcuts extended Alt + 1 to 9
- Performance: Security and coding standards improved
- Fix: Close all tabs button behaviour
- Compatibility with GlotDict 1.7.x

# 1.5
18.08.2021
- Feature: Anonymous user
- Feature: Backup settings
- Feature: Local date/time
- Fix: Use symbols in match
- Fix: Approve with warnings using kb
- Fix: Prevent error when GP is missing
- Enhancement: Refactoring code for performance
- Compatibility with GlotDict 1.7.0

# 1.4
20.07.2021
- Adds: History Count
- Adds: Consistency count
- Adds: Check Results Labels
- Adds: Count and Match option
- Adds: String History with Diff
- Adds: Check for missing end !
- Adds: Highlights for some warnings
- Change: GT button in suggestions area
- Fixes: Enables Quick Links on result pages
- Fixes: Shows warning for an empty translation
- Fixes: Enables warnings list to non PTE/GTE users
- Fixes: Reloads the checks after Save/Approve/Reject
- Obsoletes: Additional or missing end space (merged)
- Obsoletes: Notify about these words user option from UI
- Improves: Some regex replaced with a more performant function
- Improves: Features implement more design accessibility standards
- Performance: Removes duplicate jQuery library from content_scripts
- Performance: Similar loading time with considerably increased features

# 1.3
23.06.2021
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

# 1.2
12.05.2021
* Don't promt to "update" to an older version

# 1.1
12.05.2021
* Consistency data fetching performance 

# 1.0
11.05.2021
  * Search in projects
  * Quick links
  * Google Translate
  * Consistency suggestions
  * General checks
  * Romanian checks
  * Custom Shortcuts
