# Accessibility and privacy release checklist

This project is a mobile-first AI chat template. Before publishing a build, verify the following on a real Android device.

## TalkBack and keyboard

- The main page has one clear heading and a logical reading order.
- Every icon-only control has an accessible name.
- Focus is visible on links, buttons, inputs, dialogs, and menus.
- Dialogs move focus inside when opened and return focus to the trigger when closed.
- Streaming, loading, error, and stopped states are announced without trapping focus.
- The composer can be used without a pointer: type, submit, stop, retry, and clear.
- At 320–360 CSS pixels, no essential control is clipped or requires horizontal scrolling.
- Reduced-motion preferences are respected.

## Privacy and security

- Keep API keys server-side; never place secrets in `VITE_*` variables or committed source.
- Do not commit `.env`, tokens, conversation exports, or user-uploaded files.
- Document retention, logging, analytics, and model-provider data handling before production.
- Use HTTPS in production and review CORS, rate limits, and abuse controls.
- Add a clear way to delete local conversation data if persistence is enabled.

## Release evidence

Record the device, browser, build command, and date for each release test. If a check cannot be performed, mark it as pending instead of claiming it passed.
