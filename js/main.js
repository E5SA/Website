document.addEventListener("DOMContentLoaded", () => {
  // Navbar scroll effect
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    window.addEventListener("scroll", () => {
      navbar.classList.toggle("navbar-scrolled", window.scrollY > 50);
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Scroll reveal animation
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document
    .querySelectorAll(".service-card, .testimonial-card, .hero")
    .forEach((el) => observer.observe(el));

  // Scroll-reactive marquee (JS-driven, smooth lerp)
  const marqueeTrack = document.querySelector(".partners-track");
  if (marqueeTrack) {
    // Kill the CSS animation — we drive it manually
    marqueeTrack.style.animation = "none";

    const baseSpeed = -0.8;       // px per frame (negative = move left)
    const scrollMultiplier = 8;   // how much scroll boosts speed
    const lerp = 0.06;            // smoothing factor (lower = smoother)

    let currentX = 0;
    let currentSpeed = baseSpeed;
    let targetSpeed = baseSpeed;
    let lastScrollY = window.scrollY;
    let setWidth = marqueeTrack.scrollWidth / 4;

    window.addEventListener("scroll", () => {
      const delta = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      // Scroll down = speed up left, scroll up = push right
      targetSpeed = baseSpeed + delta * scrollMultiplier * -0.1;
    });

    // Ease target back to base when not scrolling
    let resetTimeout;
    window.addEventListener("scroll", () => {
      clearTimeout(resetTimeout);
      resetTimeout = setTimeout(() => {
        targetSpeed = baseSpeed;
      }, 100);
    });

    function tick() {
      // Lerp current speed towards target
      currentSpeed += (targetSpeed - currentSpeed) * lerp;
      currentX += currentSpeed;

      // Seamless loop: wrap when one set has scrolled out
      if (currentX <= -setWidth) currentX += setWidth;
      if (currentX >= 0) currentX -= setWidth;

      marqueeTrack.style.transform = "translateX(" + currentX + "px)";
      requestAnimationFrame(tick);
    }

    // Recalculate half width on resize
    window.addEventListener("resize", () => {
      setWidth = marqueeTrack.scrollWidth / 4;
    });

    requestAnimationFrame(tick);
  }

  // Horizontal scroll photo showcase (GSAP ScrollTrigger)
  const track = document.querySelector(".horizontal-track");
  const pinWrap = document.querySelector(".horizontal-pin-wrap");

  if (track && pinWrap && typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    const getScrollAmount = () => -(track.offsetWidth - window.innerWidth);

    gsap.to(track, {
      x: getScrollAmount,
      ease: "none",
      scrollTrigger: {
        trigger: ".photo-showcase",
        start: "center center",
        end: () => "+=" + Math.abs(getScrollAmount()),
        pin: pinWrap,
        scrub: true,
        invalidateOnRefresh: true,
      },
    });
  }
});
