# Browser Companion

1. Open `chrome://extensions` and enable **Developer mode**.
2. Select **Load unpacked** and choose this folder.
3. The bottom-right companion is enabled by default when no preference has been saved. The first popup switch shows or hides it across supported tabs and remembers your choice.

## Workshop baseline

All view elements, CSS, JavaScript files, and feature initialization calls are prepared. Only the first toggle is functional; the other switches stay disabled until their exercises are implemented. Preferences from the completed extension do not activate exercise features. A previously saved first-toggle preference is still respected.

Working Chrome API examples include `chrome.runtime.getURL`, `chrome.storage.local.get`/`set`, `chrome.storage.onChanged`, and the background message listener. No API requests are made by this starter.

### Useful links

#### Extension basics and debugging

- [Build your first Chrome extension](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world) - Load an unpacked extension and understand its basic structure.
- [Manifest reference](https://developer.chrome.com/docs/extensions/reference/manifest) - Look up configuration, script registration, and permissions.
- [Content scripts](https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts) - Understand how extension code runs on webpages.
- [Debug extensions](https://developer.chrome.com/docs/extensions/get-started/tutorial/debug) - Find errors and inspect the popup, content scripts, and background worker.

#### Toggles and cursor tracking

- [Chrome Storage API](https://developer.chrome.com/docs/extensions/reference/api/storage) - Save switch values and react to changes with `onChanged`.
- [Event listeners](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) - Handle clicks, keyboard input, and mouse movement.
- [Mouse coordinates](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX) - Read viewport-relative mouse positions with `clientX` and `clientY`.
- [CSS positioning](https://developer.mozilla.org/en-US/docs/Web/CSS/position) and [pointer-events](https://developer.mozilla.org/en-US/docs/Web/CSS/pointer-events) - Position the companion and control whether clicks pass through it.

#### Quotes and chat

- [Extension message passing](https://developer.chrome.com/docs/extensions/develop/concepts/messaging) - Connect the companion to the background worker using `sendMessage` and `onMessage`.
- [Cross-origin network requests](https://developer.chrome.com/docs/extensions/develop/concepts/network-requests) - Understand API requests and the required host permissions.
- [Using Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) - Request JSON, check HTTP status, and handle failures.
- [DummyJSON quotes](https://dummyjson.com/docs/quotes) - See the random-quote endpoint and its response fields.
- [Creating elements](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement) and [textContent](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent) - Add chat messages and display user or API text without treating it as HTML.

Exercises:

1. Implement cursor tracking in `cursor-companion.js`, then wire and enable its popup toggle.
2. Implement click handling in `corner-companion.js` and enable its toggle.
3. Add `https://dummyjson.com/*` to `host_permissions` in `manifest.json`. Implement `fetch("https://dummyjson.com/quotes/random")` in `background.js` and messaging from the companion. Display the returned `quote` text safely with `textContent` and handle errors.
4. Implement chat input and replies in `companion-chat.js`, then wire and enable chat mode. The quote API supplies random replies; typed messages do not need to be sent to it.

Look for `Workshop:` comments in the prepared functions. Keep the existing initialization calls in `content.js` and add settings wiring as each exercise is completed.

After installing or reloading the extension, reload any already-open pages. Chrome does not allow extensions to run on its internal pages or the Chrome Web Store. To use it on local files, enable **Allow access to file URLs** in the extension's details.

The page companion's elements are created in `companion-view.js` and styled by `companion.css`. Behavior is split between `cursor-companion.js`, `corner-companion.js`, and `companion-chat.js`; `content.js` connects them to saved settings. The popup uses `index.html`, `styles.css`, and `script.js`.

Run the starter checks with `node --test extension.test.js`.
