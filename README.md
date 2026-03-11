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
- Contact page with a form (static placeholder)
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

## Contributing

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
