# John's Website

A modern, dark-themed portfolio website with a contact form that sends notifications to your phone via Telegram.

## What's in this repo?

| What | Where | Description |
|------|-------|-------------|
| 🏠 Home page | `index.html` | Hero banner, services, testimonials, call-to-action |
| 📧 Contact page | `contact.html` | Form for customers to reach out (name, email, mobile, message) |
| 🎨 Styles | `css/style.css` | Dark theme, responsive layout, animations |
| ⚡ Scripts | `js/main.js` | Scroll effects and reveal animations |
| ☁️ Lambda | `lambda/handler.js` | Sends a Telegram message when someone submits the contact form |
| 📐 Architecture diagram | `architecture.html` | Visual flowchart of how the contact notification system works |
| 🔧 Infrastructure | `aws/` and `terraform/` | Deploy the Lambda + API Gateway to AWS |

## Quick Start

### View the site locally

Make sure you have [Node.js](https://nodejs.org/) installed, then:

```bash
node serve.js
```

Open [http://localhost:8000](http://localhost:8000) in your browser.

### On macOS/Linux (alternative)

```bash
./start.sh
```

## The Design

The site uses a **dark theme** inspired by [tazmo.com.au](https://www.tazmo.com.au/):

- **Background**: Near-black (`#0a0a0a`)
- **Accent colour**: Blue (`#4891ff`)
- **Fonts**: [Syncopate](https://fonts.google.com/specimen/Syncopate) for headings, [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) for body text
- **Icons**: [Font Awesome 7](https://fontawesome.com/)

The navbar is fixed at the top with a glass blur effect. Cards and buttons have subtle hover animations.

Between the hero and services sections, there's a **horizontal-scroll photo showcase** — a compact white strip (460px tall) containing 9 photo placeholders that scroll horizontally as you scroll down the page. It uses [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) with 1:1 scroll speed and centers on screen before scrolling begins.

A **partners marquee** section displays real estate partner logos in a smooth, scroll-reactive infinite scroll animation.

## Setting Up the Contact Form

The contact form can send you a **Telegram notification** every time a customer submits it. Here's how to set it up:

### Step 1: Create a Telegram Bot

1. Open Telegram and message [@BotFather](https://t.me/BotFather)
2. Send `/newbot` and follow the prompts
3. Save the **bot token** it gives you

### Step 2: Get Your Chat ID

1. Send any message to your new bot
2. Visit `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates` in a browser
3. Look for `"chat":{"id": 123456789}` — that number is your chat ID

### Step 3: Deploy the Backend

You have two options — pick whichever tool you're familiar with:

**Option A: AWS SAM**

```bash
cd aws
sam build
sam deploy --guided
```

It will ask for your Telegram token and chat ID during setup.

**Option B: Terraform**

```bash
cd terraform
terraform init
terraform apply \
  -var="aws_region=us-east-1" \
  -var="telegram_token=YOUR_TOKEN" \
  -var="telegram_chat=YOUR_CHAT_ID" \
  -var="alarm_email=you@example.com"
```

### Step 4: Update the Form

After deploying, you'll get an API URL in the output. Open `contact.html` and replace the placeholder:

```html
<!-- Change this: -->
<form action="https://your-api.example.com/contact" ...>

<!-- To your actual API URL: -->
<form action="https://abc123.execute-api.us-east-1.amazonaws.com/contact" ...>
```

## Hosting the Website

The site is plain HTML — no build step required. You can host it on:

- **Cloudflare Pages** (`.cfignore` already excludes backend files)
- **GitHub Pages**
- **Netlify** or **Vercel**
- Any web server (Nginx, Apache, etc.)

## What's Still Needed

- [ ] **Add logo and favicon** — Create an `images/` folder with `logo.png` and `favicon.ico`
- [ ] **Add an About page** — The "About" nav link currently goes nowhere
- [ ] **Update social media links** — Footer links are placeholders (`#`)
- [ ] **Deploy the contact backend** — Follow the steps above
- [ ] **Update form action URL** — Point it to your deployed API

## Project Structure

```
website/
├── index.html           ← Home page
├── contact.html         ← Contact form
├── architecture.html    ← System diagram
├── css/style.css        ← All styles
├── js/main.js           ← Client-side scripts
├── images/              ← (create this) Logo & favicon
├── lambda/handler.js    ← Telegram notification Lambda
├── aws/sam.yaml         ← SAM deployment template
├── terraform/           ← Terraform deployment config
├── serve.js             ← Local dev server (Node.js)
├── start.sh             ← Local dev server (Python)
├── .cfignore            ← Cloudflare Pages exclusions
├── README.md            ← Technical context (for Amp)
└── GUIDE.md             ← This file (for humans)
```

## Contributing

1. Create a branch from `main`
2. Make your changes
3. Open a pull request

```bash
git checkout -b my-feature
# make changes
git add <files>
git commit -m "Description of change"
git push origin my-feature
```
