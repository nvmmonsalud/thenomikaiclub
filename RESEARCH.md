# Research: Platform Interactivity Enhancements

This document outlines research into potential features to increase user interactivity on "The Nomikai Club" platform.

## 1. Shareable Night Plan (Recommended)

**Concept:**
Allow users to share their generated "Night Planner" results via a URL. The current planner state (Focus, Time, Pace, Group Size) would be encoded in the URL hash.

**User Flow:**
1. User selects options in the Night Planner.
2. User clicks a new "Share Plan" button.
3. The URL updates (e.g., `index.html#plan=whisky,classic,steady,small`) or copies to clipboard.
4. When another user opens this URL, the planner automatically sets the form values and regenerates the plan.

**Technical Implementation:**
- **State Encoding:** Serialize the form state into a query-string-like format in the URL hash.
- **State Restoration:** On `DOMContentLoaded`, parse `location.hash`. If a plan is present, set the values of the select/button elements and trigger the `updatePlanner()` function.

**Security Considerations:**
- **Input Sanitization:** The hash is user-controlled input. When parsing, validate that the values match the allowed options (e.g., `focus` must be one of `whisky`, `balanced`, `vinyl`).
- **DOM Safety:** Do not use `innerHTML` to display values from the URL. Only use them to select existing DOM elements (e.g., `querySelector(option[value="${safeValue}"])`).
- **XSS Risk:** Low, provided standard DOM manipulation practices (checking against allowlists) are followed.

## 2. Interactive Bar Search

**Concept:**
Add a real-time filter search bar to the `Whisky Bars` and `Vinyl Bars` listing pages.

**User Flow:**
1. User sees a "Search bars..." input at the top of the list.
2. User types "Ginza".
3. The list immediately filters to show only cards containing "Ginza".

**Technical Implementation:**
- **Event Listener:** Listen for `input` events on the search field.
- **Filtering:** Loop through all `.card` elements. Check if their `textContent` includes the search term. Toggle `style.display` to `'none'` or `'block'`.

**Security Considerations:**
- **DOM Injection:** None, as we are only toggling visibility of existing static content.
- **Performance:** For a static site with <100 items, client-side filtering is instant and efficient.

## 3. Interactive Map Pins

**Concept:**
Make the neighborhood nodes on the SVG map clickable, scrolling the user to the relevant hint or bar list.

**User Flow:**
1. User clicks the "Ginza" node on the map.
2. The page smooth-scrolls to the "Ginza" map hint or filters the bar list (if combined with feature #2).

**Technical Implementation:**
- **SVG Interactivity:** Add `class="clickable"` and `data-target="..."` to SVG groups.
- **Event Delegation:** Add a click listener to the SVG container to handle clicks on nodes.

**Security Considerations:**
- **None:** Purely UI interaction with static elements.

---

## Security Enhancement Implemented

In addition to this research, a strict **Content Security Policy (CSP)** has been implemented across the site to mitigate XSS risks. This policy restricts content sources to:
- **Scripts/Styles:** Self only (and Google Fonts).
- **Images:** Self and Unsplash (used for placeholders).
- **Objects/Frames:** None.
