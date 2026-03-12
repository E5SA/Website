# John's Website

This repository contains a simple static website with the following structure:

```
index.html
contact.html
css/style.css
js/main.js
images/           (logo, favicon, etc.)
```

## Features

- Single-page home with navigation bar
- Contact page with a form (static placeholder; can be wired to an AWS Lambda for notifications)
- Top black navigation bar and bottom footer for sprites and disclaimers

## Development

To run the site locally, start a static server in the project root. For example:

```bash
cd /Users/samuelwong/Website
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## Deployment

Since the site is entirely static, you can host it on any static site service such as GitHub Pages, Netlify, Vercel, or a simple web server.

If you need the contact form to actually send a notification, there is a small AWS Lambda function included in `lambda/` that can be deployed in front of an API Gateway.  The `aws/` and `terraform/` directories contain example SAM and Terraform configurations respectively; they are ignored by Cloudflare Pages via `.cfignore`.  See `aws/README.md` or `terraform/README.md` for instructions.

### Terraform variables

When using the Terraform configuration the following input variables must be supplied (either via `-var`, `terraform.tfvars`, or environment variables):

- `aws_region` – AWS region (e.g. `us-east-1`).
- `telegram_token` – Telegram bot token used by the Lambda.
- `telegram_chat` – Chat ID where notifications should be sent.
- `alarm_email` – Email address to receive CloudWatch alarm notifications.
- `budget_limit` – Monthly cost threshold in USD (optional; set `null` to disable).

All of these variables are declared with `default = null` in `terraform/variables.tf` so Terraform will prompt/complain if any required ones are missing.

## Contributing

_This repository now also contains AWS deployment templates (SAM and Terraform) along with a Lambda handler in `lambda/`. See the `aws/` and `terraform/` folders for details before merging your branch._


Create a branch from `main`, make your changes, and open a pull request. Example:

```bash
git checkout -b feature_sam
# edit files
git add .
git commit -m "Description of change"
git push origin feature_sam
```

## License

Add your preferred license here.
