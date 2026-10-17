# House of Tifeh

A responsive, static HTML/CSS/JavaScript website concept for House of Tifeh — “Where Beauty Meets Artistry.”

## Files
- `index.html` — page sections and multi-step appointment request form
- `styles.css` — responsive cream/chocolate styling
- `script.js` — navigation, gallery filtering/lightbox, form validation and WhatsApp handoff

## Preview locally
Open `index.html` in a browser. For a local development server, use the VS Code Live Server extension.

## Publish with GitHub Pages
1. Open the repository's **Settings** on GitHub.
2. Select **Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Select the `main` branch and `/(root)`, then save.
5. Wait for GitHub Pages to finish deploying; the Pages settings will show the published URL.

## Before launch
- Replace all placeholder beauty photos with images the artist owns or has permission to use. Gallery photos are explicitly marked as placeholders.
- Add the artist's real biography, studio address, TikTok and Facebook links.
- Replace the temporary sample content and confirm every service name with the artist.
- The booking form opens WhatsApp with the customer's details. It does **not** automatically send a message; the customer must press Send in WhatsApp.
- Direct email delivery and automated reminders are **not connected** in this static version. Add a secure backend/email provider before claiming bookings are emailed automatically. Never put private API keys in browser-side JavaScript.
- The booking form collects contact details and location. Publish an appropriate privacy notice before using it with real customers.
- Confirm the exact studio address, service area, pricing and booking/cancellation policy with the business owner.

## Accessibility and behaviour
Responsive navigation, keyboard-operable gallery controls, visible form labels and validation, a review step before handing off to WhatsApp, and reduced-motion support are included.
