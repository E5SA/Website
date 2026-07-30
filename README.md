# True Vision Media — Amp Context Document

> **Audience**: This README is written for Amp (AI coding agent). For a human-readable overview, see `GUIDE.md`.

## Project Summary

Static portfolio/business website for **True Vision Media** — a real estate media business offering property photography, CASA-accredited drone imagery and measured floorplans to agencies across Melbourne and greater Victoria. Dark-themed, single-page design inspired by [tazmo.com.au](https://www.tazmo.com.au/). The contact form is backed by an AWS Lambda that sends Telegram notifications. The site has no build step — it is plain HTML/CSS/JS served statically.

## ⚠️ ACTIVE FEATURE FLAG — read this before debugging "missing" links

`js/config.js` currently has **`hideOffHomeLinks: true`**. This is deliberate scaffolding, not a bug.

While the flag is on, every link or button that would navigate away from the home page is hidden, because those destinations aren't finished (contact form posts to a placeholder API, terms describe the wrong business, no About page, socials are `#`). **If you are wondering why the nav only shows "Home", or why the CTA section and social icons have vanished — this is why.**

### How it works

1. `js/config.js` sets `window.SITE_CONFIG.hideOffHomeLinks` and, when true, adds `.flag-hide-off-home` to `<html>`.
2. It is loaded via a plain blocking `<script>` in the `<head>` of `index.html`, `contact.html` and `terms.html` — **before** `<body>` paints, so flagged elements never flash on screen. Do not move it to the end of `<body>` or defer it.
3. Any element carrying the `data-off-home` attribute is hidden by one rule at the bottom of `css/style.css`:
   ```css
   .flag-hide-off-home [data-off-home] { display: none !important; }
   ```

### What is flagged

| Page | Elements marked `data-off-home` |
|---|---|
| all three | nav `<li>` for About, Terms, Contact; footer `.social-links` div |
| `index.html` | hero "Get In Touch" button; entire `section.cta-section`; footer "Terms of Service" link |
| `contact.html` | footer "Terms of Service" link |
| `terms.html` | `.terms-contact` div (the "Get In Touch" block) |

Containers are flagged rather than bare buttons where removing the button would leave a visibly broken block — `section.cta-section` exists only to hold its Contact button, so the whole section goes.

`Home` and the hero's "View Our Work" (`#services`) are **not** flagged; both stay on the home page.

### Turning it off / removing it

- **Re-enable the links:** set `hideOffHomeLinks: false` in `js/config.js`. Nothing else to touch.
- **Remove the feature entirely:** delete (1) `js/config.js`, (2) the `<script src="js/config.js">` tag in all three `<head>`s, (3) the `FEATURE FLAG` block at the bottom of `css/style.css`, (4) every `data-off-home` attribute (`grep -rn data-off-home *.html`).

## Repository Root

```
/Users/samuelwong/Website/Website
```

## File Map

```
.
├── index.html              # Home page — hero, photo showcase, services, partners, CTA, footer
│                           #   (testimonials section exists but is commented out — see Known Gaps)
├── contact.html            # Contact page — form (name/email/mobile/message), same nav+footer
├── terms.html              # Terms of Service page — 11 sections, dark themed
├── architecture.html       # Standalone Mermaid.js diagram showing the contact form notification flow
├── css/
│   └── style.css           # All styles — dark theme, responsive, animations
├── js/
│   ├── config.js           # ⚠️ TEMPORARY feature flags — loaded in <head> of all 3 pages
│   └── main.js             # Navbar scroll, smooth scroll, reveal, GSAP horizontal scroll, marquee
├── images/
│   ├── logo/               # 5 files. In use: TrueVisionLogoTransparent.png (nav, all pages).
│   │                       #   Unused: TrueVisionFullLogoInverted.png, TrueVisionMediaLogoInverted.png,
│   │                       #   "True Vision Media Logo.png", "TrueVIsion full logo.png" (note typo'd capital I)
│   ├── house_photos/       # 26 files on disk; 9 are wired into the horizontal scroll gallery
│   └── partners/           # 14 files on disk; only 4 are in the marquee: raywhite.png,
│                           #   fletchers.png, barryplant.svg, xcommercial.svg. Unused: bold.png,
│                           #   bricks.png, harcourts.png, lokal-agent.png, northway.png, peet.png,
│                           #   resider.png, rh-commercial.png, sk-realtors.png, ypa.png
├── lambda/
│   └── handler.js          # AWS Lambda — parses form POST, sends Telegram message
├── aws/
│   ├── sam.yaml            # AWS SAM template — Lambda + API Gateway
│   └── README.md           # SAM deployment instructions
├── terraform/
│   ├── main.tf             # Terraform config — Lambda, API GW, CloudWatch alarms, SNS
│   ├── variables.tf        # Input variables: aws_region, telegram_token, telegram_chat, alarm_email, budget_limit
│   └── README.md           # Terraform deployment instructions
├── serve.js                # Node.js static file server for local development (port 8000)
├── start.sh                # Shell helper to start python3 HTTP server (Unix/macOS)
├── .cfignore               # Excludes lambda/, aws/, terraform/, start.sh, serve.js, architecture.html, README.md, GUIDE.md from Cloudflare Pages deploy
├── .claude/
│   └── settings.local.json # Local Claude Code settings (not committed config)
├── README.md               # THIS FILE — Amp context
└── GUIDE.md                # Human-readable project guide
```

## Design System

### Theme & Colors (CSS custom properties in `:root`)

| Variable            | Value      | Usage                        |
|---------------------|------------|------------------------------|
| `--bg-dark`         | `#0a0a0a`  | Page background              |
| `--bg-card`         | `#1a1a1a`  | Card/input surfaces          |
| `--text-primary`    | `#ffffff`  | Headings, body text          |
| `--text-secondary`  | `#a0a0a0`  | Subtitles, labels, muted text|
| `--accent`          | `#4891ff`  | Buttons, links, icons        |
| `--accent-hover`    | `#6aabff`  | Hover state for accent       |
| `--radius`          | `12px`     | Border radius on cards/inputs|
| `--transition`      | `0.3s ease`| Default transition timing    |

### Typography

| Purpose    | Font Family                              | Weight | Source              |
|------------|------------------------------------------|--------|---------------------|
| Headings   | `Syncopate`                              | 700    | Google Fonts        |
| Body       | `Space Grotesk`, `Spline Sans` fallback  | 500,700| Google Fonts        |

All headings use `text-transform: uppercase` and `letter-spacing: 0.04em`.

### Icons

Font Awesome 7.0.1 via CDN (`cdnjs.cloudflare.com`). Used for:
- Service cards: `fa-camera`, `fa-helicopter`, `fa-compass-drafting`
- Contact button: `fa-regular fa-envelope`
- Social footer: `fa-brands fa-tiktok`, `fa-youtube`, `fa-facebook`, `fa-instagram`

## HTML Structure

### index.html Sections (in DOM order)

1. **`nav.navbar`** — Fixed top, glassmorphic (`backdrop-filter: blur`). Left side is the brand lockup: `TrueVisionLogoTransparent.png` (78px tall) followed by a `span.site-name` wordmark reading "True Vision Media" (Syncopate, uppercase, `1rem`), both inside the `a[href="index.html"]` which is `display: flex` with a `14px` gap. The `<img>` carries `alt=""` because the adjacent text already names the brand — don't restore the alt text or screen readers announce it twice. Nav links right (Home, About, Terms, Contact); Contact is `.btn` styled. Hides on scroll-down (`.navbar--hidden`), shows compact on scroll-up (`.navbar--compact`, which shrinks the logo to 28px and the wordmark to `0.8rem`), full size when at top. The wordmark is `display: none` below 480px so it can't crowd the nav links.
2. **`section.hero`** — Full viewport (`min-height: 100vh`), centered. `h1 "Every Property, Perfectly Framed"` + `p` (real estate media positioning, Melbourne/Victoria) + two CTA buttons: "View Our Work" (`.btn-accent`, `href="#services"`) and "Get In Touch" (`.btn-outline`, `href="contact.html"`). Radial gradient glow via `::before`.
3. **`div.photo-showcase`** — Horizontal-scroll photo gallery. `.horizontal-pin-wrap` (`100vh`, white `#ffffff` background, `overflow: hidden`) is pinned by GSAP ScrollTrigger. `.horizontal-track` (`width: max-content`, padding `0 12px`, gap `12px`) contains 9 real property photo `.photo-placeholder` elements with viewport-relative heights (`.photo-tall` `calc(96vh - 20px)`, `.photo-medium` `calc(94vh - 20px)`, `.photo-short` `calc(92vh - 20px)`) and a `.photo-track-end` spacer (120px). Photos use `height: 100%; width: auto`. Pins at `center center`. `scrub: 0.1` for smooth scroll. `end` uses `track.scrollWidth - window.innerWidth`. ScrollTrigger refreshed on `window.load` to account for image load times.
4. **`section.services#services`** — `h2 "What We Do"` + `.services-grid` (CSS grid, 3→2→1 cols responsive). 3 `.service-card` elements: Photography (`fa-camera`), Drones (`fa-helicopter`), Floorplans (`fa-compass-drafting`). Carries `id="services"` as the hero "View Our Work" anchor target.
5. **`section.partners`** — `.partners-header` (`h2 "Partnered With"` uppercase + descriptive `p`) inside a `.container`, then `.partners-marquee[data-marquee-direction="left"]` > `.partners-track`. 4 partner logos, each `.partner-logo` followed by a `.partner-spacer` div, with the whole set repeated 4× for seamless looping. Ray White gets a `.partner-logo--raywhite` scale override. Scroll-reactive with lerp smoothing.
6. **`section.testimonials`** — **Currently commented out.** The markup remains in place as an HTML comment containing a fill-in template (`[Client quote]` / `[Client name]` / `[Agency]`). The original three testimonials were template placeholder copy — invented names with invented quotes about software delivery — so they were removed rather than rebranded. Uncomment and fill in once real client quotes exist. Structure when enabled: `h2` + `.testimonials-grid` (3→2→1 cols) + `.testimonial-card` with quote `<p>` and author `<span><strong>`.
7. **`section.cta-section`** — `h2` + `p` + `.btn-accent` linking to `contact.html`.
8. **`footer.site-footer`** — `.social-links` (4 icon links) + `.footer-disclaimer` + Terms of Service link.

### contact.html Sections

1. **`nav.navbar`** — Identical to index.html.
2. **`main.content > section.contact-section`** — `h1` + `p` + `form.contact-form`. Form fields: name (text), email (email), mobile (tel), message (textarea). Action URL is placeholder: `https://your-api.example.com/contact`. Submit button is `<button type="submit">`.
3. **`footer.site-footer`** — Identical to index.html.

### terms.html

Terms of Service page with 11 sections (Introduction, Scope of Services, Bookings, Client Responsibilities, Pricing, IP, Liability, Cancellation, Privacy, Governing Law, Entire Agreement). Uses `.terms-section` and `.terms-content` CSS classes. Same nav and footer as other pages. Section 10 names **Victoria, Australia** as the governing jurisdiction.

⚠️ **The body copy still describes a software agency, not a real estate media business.** See Known Gaps — this is the largest outstanding content problem in the repo.

### architecture.html

Standalone page using Mermaid.js (CDN v11) to render a flowchart of the contact form notification architecture. Dark themed, matches site style. Has 6 legend cards explaining each component.

## CSS Architecture (`css/style.css`)

Single flat CSS file, ~900 lines. Organised in sections:
1. **Reset & Root** — Box-sizing, CSS variables
2. **Utility** — `.container` (1200px), `.container-sm` (800px), section padding
3. **Navbar** — Fixed, transparent bg with blur, border-bottom. `.logo a` is `display: flex` (14px gap) holding the logo image plus `.site-name` wordmark (Syncopate, uppercase, `0.04em` tracking). `.navbar--hidden` (slides up, opacity 0). `.navbar--compact` (shrinks padding, logo height 28px, wordmark to `0.8rem`, smaller nav font).
4. **Buttons** — `.btn`, `.btn-accent`, `.btn-outline`, `.hero-buttons`
5. **Hero** — Flexbox centered, clamp() font sizing, `::before` radial glow
6. **Photo Showcase** — `.photo-showcase` (transparent bg), `.horizontal-pin-wrap` (`100vh`, white bg, overflow hidden), `.horizontal-track` (flex, gap `12px`, padding `0 12px`, `width: max-content`, `height: 100%`). Photo height classes: `.photo-tall` (`calc(96vh - 20px)`), `.photo-medium` (`calc(94vh - 20px)`), `.photo-short` (`calc(92vh - 20px)`). Photos are `height: 100%; width: auto`. `.photo-track-end` spacer (120px wide). No border or border-radius on photos — black bg.
7. **Services** — Grid layout, `.service-card` with hover lift/shadow/border
8. **Partners** — `.partners-header` (uppercase heading + descriptive paragraph), `.partners-marquee` / `.partners-track` with `.partner-logo` and `.partner-spacer` elements, brightness/invert filter, `.partner-logo--raywhite` scale override
9. **Testimonials** — Grid layout, `.testimonial-card` with `::before` decorative quote mark
10. **CTA Section** — Centered text, radial glow bg
11. **Terms of Service** — `.terms-section`, `.terms-content` with styled h2/h3/p/ul elements, `.terms-contact` CTA
12. **Contact Form** — Dark inputs, accent focus ring, labels, button styling
13. **Footer** — `.social-links` circular icon buttons, disclaimer, Terms link
14. **Animations** — `@keyframes fadeInUp`, `.fade-in-up`
15. **Responsive** — Breakpoints at 992px, 768px, 480px. At 768px the wordmark drops to `0.8rem` and the logo gap to 10px; at 480px `.site-name` is hidden entirely.
16. **Temporary Feature Flag** — final block in the file: `.flag-hide-off-home [data-off-home] { display: none !important; }`. See the feature-flag section at the top of this README. Delete the whole block when the flag is retired.

## JavaScript

### `js/config.js` — temporary feature flags

Loaded first, synchronously in `<head>` on all three pages. Sets `window.SITE_CONFIG` and applies `.flag-hide-off-home` to `<html>`. No dependencies. See the feature-flag section at the top of this README.

### `js/main.js`

Vanilla JS, depends on GSAP + ScrollTrigger (CDN). Five features:
1. **Navbar scroll** — Hides navbar (`.navbar--hidden`) when scrolling down past 80px; shows compact version (`.navbar--compact`) when scrolling up; removes compact at top. Smooth `transform/opacity` transition.
2. **Smooth scroll** — Intercepts `a[href^="#"]` clicks, uses `scrollIntoView`.
3. **Scroll reveal** — `IntersectionObserver` on `.service-card`, `.testimonial-card`, `.hero`; adds `.revealed` class; unobserves after trigger.
4. **Horizontal photo scroll** — GSAP ScrollTrigger pins `.horizontal-pin-wrap` and translates `.horizontal-track` horizontally as the user scrolls. `scrub: 0.1` for smooth scrolling. `start: "center center"`. `end` uses `track.scrollWidth - window.innerWidth`. The white strip (`100vh`, `overflow: hidden`) is on the pin wrap, not the outer section. `ScrollTrigger.refresh()` called on `window.load` to get accurate track width after images load.
5. **Partners marquee** — JS-driven `requestAnimationFrame` loop with lerp smoothing. Scroll-reactive: speeds up on scroll, reverses on scroll-up, settles back to base drift. Constants: `baseSpeed=-0.8`, `scrollMultiplier=8`, `lerp=0.06`. Track width divided by 4 (4 logo sets) for seamless wrapping in both directions.

## Backend / Infrastructure

### Lambda (`lambda/handler.js`)

- **Runtime**: Node.js 18+ (uses `node-fetch` or built-in fetch)
- **Input**: JSON body `{ name, email, mobile, message }` via API Gateway proxy
- **Validation**: Requires `name`, `email`, `mobile`; returns 400 if missing
- **Action**: Sends formatted Markdown message to Telegram via Bot API
- **Env vars**: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`
- **Output**: `{ statusCode: 200, body: 'OK' }` or error

### SAM (`aws/sam.yaml`)

- `ContactFunction`: Lambda, nodejs18.x, `lambda/handler.js`
- `ContactApi`: API Gateway, `POST /contact`, CORS enabled
- Parameters: `TelegramToken`, `TelegramChat`
- Output: `ApiUrl` — the invoke URL to set as form action

### Terraform (`terraform/main.tf` + `variables.tf`)

- Lambda function `contactForm` + IAM role
- HTTP API Gateway v2 + integration + route `POST /contact` + auto-deploy stage
- Lambda permission for API Gateway invocation
- **CloudWatch alarm** `contact-high-invocations`: fires if >100 invocations in 5 minutes
- **CloudWatch alarm** `monthly-cost`: fires if estimated charges exceed `budget_limit`
- **SNS topic** `ops-alerts` with email subscription to `alarm_email`
- Variables (all default `null`): `aws_region`, `telegram_token`, `telegram_chat`, `alarm_email`, `budget_limit`

## Local Development

### Option 1: Node.js (Windows — recommended, serve.js already exists)

```bash
node serve.js
# Open http://localhost:8000
```

### Option 2: Python (macOS/Linux)

```bash
./start.sh
# or: python3 -m http.server 8000
```

## Deployment

### Static site

Host on Cloudflare Pages, GitHub Pages, Netlify, Vercel, or any static server. `.cfignore` excludes backend files from Cloudflare deploys.

### Contact form backend

1. Create Telegram bot via @BotFather → get token
2. Get chat ID from `https://api.telegram.org/bot<TOKEN>/getUpdates`
3. Deploy with SAM (`sam build && sam deploy --guided`) or Terraform (`terraform apply`)
4. Update `contact.html` form `action` URL with the API Gateway endpoint from deploy output

## Known Gaps / TODOs

Verified against the working tree — do not assume anything below is already fixed.

### Temporary scaffolding to remove

- **`hideOffHomeLinks` flag is ON** in `js/config.js`, hiding all navigation off the home page. Must be turned off before launch — otherwise visitors cannot reach the contact page at all. See the feature-flag section at the top of this README for the full removal checklist.

### Content

- **`terms.html` describes the wrong business.** The 2026-07-30 rebrand pass was a name swap only. The Scope of Services list (lines 53–59) still offers *web development, UI/UX design, cloud solutions and infrastructure, mobile application development, technology consulting*. The `.terms-intro` paragraph still calls the business "your trusted partner in digital solutions", and the IP/copyright, liability and cancellation clauses are written for software deliverables ("code, designs, graphics, and documentation", "production environments", "project value"). **This is the highest-value remaining fix.** A proper rewrite should cover image licensing to agencies, weather-related reshoots, site access, and Australian Consumer Law — and should be reviewed by a lawyer, not just an agent.
- **Testimonials are hidden, not written.** `index.html` has the section commented out with a fill-in template. Needs real client quotes with permission to publish. Do not populate it with invented names or quotes.
- **About page** — Nav links to `#` on every page. No about page or section exists.

### Assets

- **`images/favicon.ico` does not exist** — but is referenced by `index.html`, `contact.html` and `terms.html`. Every page currently 404s on its favicon. Can be generated from `TrueVisionLogoTransparent.png`.
- **`images/logo/"TrueVIsion full logo.png"`** — filename has a typo'd capital `I` and a space. Unused; rename or delete.
- **Unused assets** — 10 of 14 partner logos and 17 of 26 house photos are not referenced by any page.
- **No meta descriptions** on any page.

### Repo hygiene

- **No `.gitignore` exists.** This is why `.DS_Store` and `images/.DS_Store` ended up staged. Add a `.gitignore` with `.DS_Store` and run `git rm --cached` on the tracked copies.

### Backend / frontend wiring

- **Contact form action URL** — still the placeholder `https://your-api.example.com/contact` ([contact.html](contact.html) line 46). Must be updated after backend deployment.
- **No form client-side validation feedback** — Form uses HTML5 `required` but no JS validation or success/error messaging after submit.
- **Social media links** — All four are `href="#"` placeholders. Need real URLs.
- **No mobile hamburger menu** — Navbar links stack/shrink on mobile but there is no burger toggle for very small screens.
