# John's Website — Amp Context Document

> **Audience**: This README is written for Amp (AI coding agent). For a human-readable overview, see `GUIDE.md`.

## Project Summary

Static portfolio/business website for "John's Website". Dark-themed, single-page design inspired by [tazmo.com.au](https://www.tazmo.com.au/). The contact form is backed by an AWS Lambda that sends Telegram notifications. The site has no build step — it is plain HTML/CSS/JS served statically.

## Repository Root

```
c:/Users/l172955/website/
```

## File Map

```
.
├── index.html              # Home page — hero, services grid, testimonials, CTA, footer
├── contact.html            # Contact page — form (name/email/mobile/message), same nav+footer
├── architecture.html       # Standalone Mermaid.js diagram showing the contact form notification flow
├── css/
│   └── style.css           # All styles — dark theme, responsive, animations
├── js/
│   └── main.js             # Navbar scroll effect, smooth scroll, IntersectionObserver reveal
├── images/                 # (NOT YET CREATED) — expected to contain logo.png, favicon.ico
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
├── .cfignore               # Excludes lambda/, aws/, terraform/, start.sh from Cloudflare Pages deploy
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
- Service cards: `fa-code`, `fa-palette`, `fa-cloud`, `fa-mobile-screen`, `fa-lightbulb`
- Contact button: `fa-regular fa-envelope`
- Social footer: `fa-brands fa-tiktok`, `fa-youtube`, `fa-facebook`, `fa-instagram`

## HTML Structure

### index.html Sections (in DOM order)

1. **`nav.navbar`** — Fixed top, glassmorphic (`backdrop-filter: blur`). Logo left, nav links right. Contact link is `.btn` styled.
2. **`section.hero`** — Full viewport (`min-height: 100vh`), centered. `h1` + `p` + two CTA buttons (`.btn-accent`, `.btn-outline`). Radial gradient glow via `::before`.
3. **`div.photo-showcase`** — Horizontal-scroll photo gallery. `.horizontal-pin-wrap` (460px, white `#ffffff` background, `overflow: hidden`) is pinned by GSAP ScrollTrigger. `.horizontal-track` contains 9 `.photo-placeholder` elements with varying heights (`.photo-tall` 420px, `.photo-medium` 340px, `.photo-short` 260px). Pins at `center center` so photos are centered on screen. `scrub: true` for 1:1 scroll speed. Gap `24px`, side padding `30px`.
4. **`section.services`** — `h2` + `.services-grid` (CSS grid, 3→2→1 cols responsive). 5 `.service-card` elements, each with icon (`<i>`), `<h3>`, `<p>`.
5. **`section.partners`** — `&campaigns` heading + JS-driven marquee with 12 partner logos (duplicated for seamless loop). Scroll-reactive with lerp smoothing.
6. **`section.testimonials`** — `h2` + `.testimonials-grid` (3→2→1 cols). 3 `.testimonial-card` with quote `<p>`, author `<span><strong>`.
7. **`section.cta-section`** — `h2` + `p` + `.btn-accent` linking to `contact.html`.
8. **`footer.site-footer`** — `.social-links` (4 icon links) + `.footer-disclaimer`.

### contact.html Sections

1. **`nav.navbar`** — Identical to index.html.
2. **`main.content > section.contact-section`** — `h1` + `p` + `form.contact-form`. Form fields: name (text), email (email), mobile (tel), message (textarea). Action URL is placeholder: `https://your-api.example.com/contact`. Submit button is `<button type="submit">`.
3. **`footer.site-footer`** — Identical to index.html.

### architecture.html

Standalone page using Mermaid.js (CDN v11) to render a flowchart of the contact form notification architecture. Dark themed, matches site style. Has 6 legend cards explaining each component.

## CSS Architecture (`css/style.css`)

Single flat CSS file, ~900 lines. Organised in sections:
1. **Reset & Root** — Box-sizing, CSS variables
2. **Utility** — `.container` (1200px), `.container-sm` (800px), section padding
3. **Navbar** — Fixed, transparent bg with blur, border-bottom
4. **Buttons** — `.btn`, `.btn-accent`, `.btn-outline`, `.hero-buttons`
5. **Hero** — Flexbox centered, clamp() font sizing, `::before` radial glow
6. **Photo Showcase** — `.photo-showcase` (transparent bg), `.horizontal-pin-wrap` (460px, white bg, overflow hidden), `.horizontal-track` (flex, gap 24px, padding 30px). Photo height classes: `.photo-tall` (420px), `.photo-medium` (340px), `.photo-short` (260px)
7. **Services** — Grid layout, `.service-card` with hover lift/shadow/border
8. **Partners** — `&campaigns` heading, marquee track with partner logos, brightness/invert filter, Ray White scale override
9. **Testimonials** — Grid layout, `.testimonial-card` with `::before` decorative quote mark
10. **CTA Section** — Centered text, radial glow bg
11. **Contact Form** — Dark inputs, accent focus ring, labels, button styling
12. **Footer** — `.social-links` circular icon buttons, disclaimer
13. **Animations** — `@keyframes fadeInUp`, `.fade-in-up`
14. **Responsive** — Breakpoints at 992px, 768px, 480px

## JavaScript (`js/main.js`)

Vanilla JS, depends on GSAP + ScrollTrigger (CDN). Five features:
1. **Navbar scroll** — Adds `.navbar-scrolled` class when `scrollY > 50`.
2. **Smooth scroll** — Intercepts `a[href^="#"]` clicks, uses `scrollIntoView`.
3. **Scroll reveal** — `IntersectionObserver` on `.service-card`, `.testimonial-card`, `.hero`; adds `.revealed` class; unobserves after trigger.
4. **Horizontal photo scroll** — GSAP ScrollTrigger pins `.horizontal-pin-wrap` and translates `.horizontal-track` horizontally as the user scrolls. `scrub: true` for 1:1 speed matching. `start: "center center"` so photos are centered on screen before scrolling begins. The white strip (`460px` tall, `overflow: hidden`) is on the pin wrap, not the outer section (so ScrollTrigger's spacer doesn't show white).
5. **Partners marquee** — JS-driven `requestAnimationFrame` loop with lerp smoothing. Scroll-reactive: speeds up on scroll, reverses on scroll-up, settles back to base drift. Constants: `baseSpeed=-0.8`, `scrollMultiplier=8`, `lerp=0.06`.

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

- **`images/` directory does not exist** — `logo.png` and `favicon.ico` are referenced but missing. These need to be created/added.
- **About page** — Nav links to `#` (no about page or section exists yet).
- **Contact form action URL** — Still set to placeholder `https://your-api.example.com/contact`. Must be updated after backend deployment.
- **No mobile hamburger menu** — Navbar links stack/shrink on mobile but there is no burger toggle for very small screens.
- **`serve.js` and `architecture.html`** — Development/documentation files; should be added to `.cfignore` if deploying to Cloudflare.
- **Social media links** — All `href="#"` placeholders. Need real URLs.
- **No form client-side validation feedback** — Form uses HTML5 `required` but no JS validation or success/error messaging after submit.
