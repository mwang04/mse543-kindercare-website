# KinderCare — Informational Website

A responsive, multi-page marketing/informational site for **KinderCare**, a caregiving support app that helps family caregivers manage medications, appointments, and recovery. Built for a University of Waterloo Management Engineering capstone project.

## Pages
| File | Page |
|------|------|
| `index.html` | Home — problem, solution, benefits, features, statistics |
| `about.html` | About Us — founding story, values, team |
| `demo.html` | Demo — fully clickable phone walkthrough of the app |
| `contact.html` | Contact Us — contact form + newsletter signup |

Every page shares the same sticky **navigation bar** and **footer** (with the required tracking disclaimer), plus `assets/styles.css` and `assets/main.js`.

---

## 1. Deploy to GitHub Pages

1. Create a new GitHub repository (e.g. `kindercare`) and push all files, keeping the folder structure intact (`index.html` must sit at the repository root, alongside the `assets/` folder).
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Select branch `main` and folder `/ (root)`, then **Save**.
5. After a minute, your site is live at `https://<your-username>.github.io/<repo-name>/`.

No build step is required — these are plain static files.

---

## 2. Connect Google Analytics 4

The GA tag is already embedded in the `<head>` of **every** page. You only need to swap in your real Measurement ID.

1. In [Google Analytics](https://analytics.google.com), create a **GA4 property** and a **Web data stream** for your GitHub Pages URL.
2. Copy the **Measurement ID** (looks like `G-XXXXXXXXXX`).
3. Find-and-replace the placeholder `G-XXXXXXXXXX` with your ID in all four HTML files (it appears twice per file — in the script `src` and in the `gtag('config', …)` call).

That's it — page views start flowing automatically.

---

## 3. The three tracked tasks (custom events)

All event logic lives in `assets/main.js` (and `assets/demo.js` for the demo) and fires through `gtag('event', …)`.

| Task | Event name | Fires when | Key parameters |
|------|-----------|------------|----------------|
| **Contact us** | `contact_us` | Contact form submitted | `contact_reason`, `method` |
| **Demo** | `view_demo` | Visitor steps through the interactive demo | `screen_name`, `demo_screens_viewed` |
| **Newsletter signup** | `newsletter_signup` | Newsletter form submitted | `signup_role`, `location` |

These appear in GA4 under **Reports → Engagement → Events** (allow ~24h, or use **Admin → DebugView** for real-time testing).

> **Mark them as conversions (key events):** In GA4, go to **Admin → Events**, find each event, and toggle **Mark as key event**.

---

## 4. The custom metric

The required custom metric is **`demo_screens_viewed`** — an integer sent with every `view_demo` event recording how many *unique* app screens a visitor actually clicked through (1–7). This measures **engagement depth**, not just whether the demo was opened.

To make it usable in reports, register it in GA4:

1. **Admin → Custom definitions → Custom metrics → Create custom metric.**
2. Metric name: `Demo screens viewed`
3. Scope: **Event**
4. Event parameter: `demo_screens_viewed`
5. Unit of measurement: **Standard**

After registration it can be used in Explorations to see, e.g., average screens explored per session.

---

## 5. Testing events locally

Open the site, then open your browser console — every tracked event is also logged via `console.debug('[GA event]', …)`, so you can confirm the logic fires even before GA is connected.

---

## Tech notes
- No frameworks or build tools — plain HTML/CSS/JS.
- Fonts: Instrument Serif (display) + Inter (body), loaded from Google Fonts.
- Responsive down to mobile, with a hamburger menu, visible focus states, and `prefers-reduced-motion` respected.
- Forms are demo-only (no backend); they reset and show a success message on submit.
