/* ==========================================================================
   TEMPORARY FEATURE FLAGS
   ==========================================================================
   This whole file is scaffolding. Delete it once the pages it hides are ready.

   hideOffHomeLinks
     true  -> hides every link and button that would navigate away from the
              home page, because those destinations aren't finished yet.
     false -> normal site behaviour, everything visible.

   What it hides (anything marked data-off-home in the HTML):
     - nav items:  About, Terms, Contact
     - hero:       "Get In Touch" button
     - whole CTA section ("Let's Work Together") — its only action was Contact
     - footer:     the social icon row, and the Terms of Service link

   To turn the site back on: set hideOffHomeLinks to false. To remove the
   feature entirely, delete (1) this file, (2) the <script src="js/config.js">
   tag in the <head> of index/contact/terms.html, (3) the FEATURE FLAG block at
   the bottom of css/style.css, and (4) every data-off-home attribute.

   This file is loaded synchronously in <head> — before <body> paints — so
   flagged elements never flash on screen before being hidden.
   ========================================================================== */

window.SITE_CONFIG = {
  hideOffHomeLinks: true,
};

if (window.SITE_CONFIG.hideOffHomeLinks) {
  document.documentElement.classList.add("flag-hide-off-home");
}
