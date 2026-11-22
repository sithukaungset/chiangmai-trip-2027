(() => {
  const hotels = [
    { name: "Anodard Hotel", lat: 18.7856, lng: 98.9869, kind: "hotel", blurb: "Budget · Old City" },
    { name: "POR Thapae Gate", lat: 18.7876, lng: 98.9933, kind: "hotel", blurb: "Boutique · recommended" },
    { name: "Hotel M Chiang Mai", lat: 18.7881, lng: 98.9936, kind: "hotel", blurb: "Mid-range · Tha Phae" },
    { name: "99 the Heritage", lat: 18.7887, lng: 98.9815, kind: "hotel", blurb: "Premium · Wat Phra Singh" },
    { name: "B2 Santitham", lat: 18.8035, lng: 98.9855, kind: "hotel", blurb: "Budget chain" },
  ];

  const courses = [
    { name: "Lanna Golf Club", lat: 18.8245, lng: 98.9788, kind: "golf", blurb: "Nearest · pick · Apr 16 · ₩53,300" },
    { name: "North Hill Golf Club", lat: 18.8492, lng: 99.0186, kind: "golf", blurb: "₩98,800 · backup" },
    { name: "Mae Jo Golf Club", lat: 18.8965, lng: 99.0458, kind: "golf", blurb: "₩112,600 · backup" },
    { name: "Chiang Mai Highlands", lat: 18.8410, lng: 99.1680, kind: "golf", blurb: "₩134,300 · farther" },
    { name: "Alpine Golf Resort", lat: 18.7725, lng: 99.1920, kind: "golf", blurb: "₩146,200" },
  ];

  function pinIcon(kind) {
    const color = kind === "golf" ? "#2f5d3a" : "#c45c3e";
    return L.divIcon({
      className: "",
      html: `<span style="
        display:block;width:14px;height:14px;border-radius:50%;
        background:${color};border:2px solid #fffaf4;
        box-shadow:0 2px 8px rgba(0,0,0,.35);
      "></span>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7],
    });
  }

  function initMap() {
    const el = document.getElementById("trip-map");
    if (!el || typeof L === "undefined") return;

    const map = L.map(el, {
      scrollWheelZoom: false,
      zoomControl: true,
    }).setView([18.82, 99.05], 11);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      maxZoom: 18,
    }).addTo(map);

    const bounds = [];
    [...hotels, ...courses].forEach((place) => {
      const marker = L.marker([place.lat, place.lng], { icon: pinIcon(place.kind) }).addTo(map);
      marker.bindPopup(`<strong>${place.name}</strong><br>${place.blurb}`);
      bounds.push([place.lat, place.lng]);
    });

    if (bounds.length) {
      map.fitBounds(bounds, { padding: [36, 36] });
    }

    el.addEventListener(
      "wheel",
      (e) => {
        if (e.ctrlKey || e.metaKey) {
          map.scrollWheelZoom.enable();
        } else {
          map.scrollWheelZoom.disable();
        }
      },
      { passive: true }
    );
  }

  function observeReveal() {
    const nodes = document.querySelectorAll(".place-card, .day");
    if (!("IntersectionObserver" in window)) {
      nodes.forEach((n) => n.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    nodes.forEach((n, i) => {
      n.style.transitionDelay = `${(i % 5) * 70}ms`;
      io.observe(n);
    });
  }

  function softNav() {
    document.querySelectorAll('.site-nav a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        const id = link.getAttribute("href");
        const target = id && document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  window.addEventListener("DOMContentLoaded", () => {
    initMap();
    observeReveal();
    softNav();
  });
})();
