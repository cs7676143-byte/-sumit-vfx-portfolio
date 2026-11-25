(() => {
  const STORAGE_KEY = "aura_edits_vfx_config_v1";
  const ADMIN_PASS = "sumit111";
  const CATEGORIES = ["All", "Reels", "Promo", "VFX", "Wedding", "Podcasts"];

  // Firebase Configuration (Project: aura-ae380)
  const firebaseConfig = {
    apiKey: "AIzaSyBW7W6ovqUwsjTFDd5xCyHQ8M-jboIJSVU",
    authDomain: "aura-ae380.firebaseapp.com",
    databaseURL: "https://aura-ae380-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "aura-ae380",
    storageBucket: "aura-ae380.firebasestorage.app",
    messagingSenderId: "1062935602434",
    appId: "1:1062935602434:web:2159fb1968c9988e458e1b",
    measurementId: "G-5B3NV8409H"
  };

  let dbRef = null;
  if (window.firebase) {
    try {
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }
      dbRef = firebase.database().ref("aura_portfolio");
    } catch (e) {
      console.error("Firebase Init Error:", e);
    }
  }

  const DEFAULT_CONFIG = {
    brand: {
      name: "Aura Edits VFX",
      heroBadge: "AVAILABLE FOR COMMERCIAL & CREATOR PROJECTS",
      heroHeadline: "Crafting *Cinematic* Cuts & Seamless VFX",
      heroTagline:
        "High-retention storytelling, frame-accurate pacing, and Hollywood-grade color & compositing built to command attention.",
      heroBio:
        "Partnering with creators, brands, and agencies to transform raw footage into visually unforgettable narratives.",
      expYears: "2+",
      expLabel: "Years of Professional Video Editing Experience",
      expSubtext:
        "Delivering high-retention edits, kinetic motion design, and cinematic grading across commercial promos, viral reels, podcasts, and VFX-heavy productions.",
      reelTitle: "Aura Edits — VFX & Color Showcase",
      reelDuration: "01:24 // 4K HDR",
      reelUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
      reelThumb: ""
    },
    theme: {
      accent: "#9333EA",
      secondary: "#F59E0B",
      glow: "#7E22CE",
      headingFont: "Plus Jakarta Sans"
    },
    stats: [
      { value: "2+", numeric: 2, suffix: "+", label: "Years Experience" },
      { value: "180+", numeric: 180, suffix: "+", label: "Edits Delivered" },
      { value: "4K 60", numeric: 60, suffix: "fps", label: "HDR Mastering" },
      { value: "100%", numeric: 100, suffix: "%", label: "Client Retention" }
    ],
    videos: [
      {
        id: "vid-1",
        title: "Cyberpunk Sneaker Launch",
        category: "VFX",
        url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
        thumb: "",
        description: "3D camera tracking, neon rotoscoping, speed-ramping, and custom sound design for a high-energy footwear drop."
      },
      {
        id: "vid-2",
        title: "Creator Viral Hook Reel",
        category: "Reels",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        thumb: "",
        description: "Fast-paced 9:16 retention cut with kinetic captions, beat-synced transitions, and punchy SFX."
      },
      {
        id: "vid-3",
        title: "Luxury Fragrance Commercial",
        category: "Promo",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        thumb: "",
        description: "ACES film emulation color grade in DaVinci Resolve paired with clean particle compositing."
      },
      {
        id: "vid-4",
        title: "Udaipur Royal Wedding Teaser",
        category: "Wedding",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoy.mp4",
        thumb: "",
        description: "Emotional narrative pacing, warm halation look, and orchestral audio mastering."
      },
      {
        id: "vid-5",
        title: "Founders Unfiltered Episode 14",
        category: "Podcasts",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        thumb: "",
        description: "Multi-cam switching, studio dialogue cleanup, animated lower-thirds, and micro-clip cutdowns."
      },
      {
        id: "vid-6",
        title: "CGI Portal Sequence Breakdown",
        category: "VFX",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        thumb: "",
        description: "Match-moved sky replacement, volumetric glow passes, and seamless clean-plate compositing."
      }
    ],
    software: [
      {
        id: "sw-1",
        name: "DaVinci Resolve",
        role: "Color Grading & Editing",
        icon: "davinci",
        tag: "ACES COLOR // NODE GRADING",
        description: "Film print emulation, skin-tone isolation, halation, and HDR finishing."
      },
      {
        id: "sw-2",
        name: "Adobe After Effects",
        role: "VFX & Motion Graphics",
        icon: "aftereffects",
        tag: "3D TRACKING // COMPOSITING",
        description: "Kinetic typography, rotoscoping, clean-plating, and procedural visual effects."
      },
      {
        id: "sw-3",
        name: "Adobe Premiere Pro",
        role: "High-Retention Storytelling & Cuts",
        icon: "premiere",
        tag: "RHYTHM CUTS // SOUND DESIGN",
        description: "Multi-cam editorial, frame-accurate pacing, and immersive SFX layering."
      }
    ],
    contact: {
      phone: "9213482237",
      countryCode: "91",
      socials: [
        { id: "soc-1", label: "Instagram", url: "https://instagram.com" },
        { id: "soc-2", label: "YouTube", url: "https://youtube.com" },
        { id: "soc-3", label: "Behance", url: "https://behance.net" }
      ]
    }
  };

  let config = loadConfig();
  let activeCategory = "All";
  let isAdminUnlocked = false;
  let videoObserver = null;
  let firebaseSaveTimer = null;
  let hasRemoteData = false;

  // ---------- Storage & Firebase Sync ----------
  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function loadConfig() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return deepClone(DEFAULT_CONFIG);
      const parsed = JSON.parse(raw);
      return mergeDefaults(deepClone(DEFAULT_CONFIG), parsed);
    } catch {
      return deepClone(DEFAULT_CONFIG);
    }
  }

  function mergeDefaults(base, incoming) {
    if (!incoming || typeof incoming !== "object") return base;
    const mergedTheme = { ...base.theme, ...(incoming.theme || {}) };
    if (!["Plus Jakarta Sans", "Inter", "Outfit"].includes(mergedTheme.headingFont)) {
      mergedTheme.headingFont = "Plus Jakarta Sans";
    }
    return {
      brand: { ...base.brand, ...(incoming.brand || {}) },
      theme: mergedTheme,
      stats: Array.isArray(incoming.stats) && incoming.stats.length ? incoming.stats : base.stats,
      videos: Array.isArray(incoming.videos) ? incoming.videos : base.videos,
      software: Array.isArray(incoming.software) ? incoming.software : base.software,
      contact: {
        ...base.contact,
        ...(incoming.contact || {}),
        socials: Array.isArray(incoming.contact?.socials) ? incoming.contact.socials : base.contact.socials
      }
    };
  }

  function saveConfig(showNotice = true) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {
      showToast("Local storage full — syncing to Firebase...");
    }

    const status = document.getElementById("admin-save-status");
    if (!dbRef) {
      if (status && showNotice) status.textContent = "● Saved locally";
      return;
    }

    if (status && showNotice) {
      status.textContent = "● Saving to Firebase...";
    }

    clearTimeout(firebaseSaveTimer);
    firebaseSaveTimer = setTimeout(() => {
      dbRef
        .set({ ...config, _pass: ADMIN_PASS })
        .then(() => {
          hasRemoteData = true;
          if (status && showNotice) {
            status.textContent = "● Live on Firebase (All Users)";
          }
        })
        .catch((err) => {
          console.error("Firebase Save Error:", err);
          if (status) status.textContent = "● Firebase Sync Error — Check Rules";
          showToast("Firebase save failed — verify Realtime Database Rules");
        });
    }, 300);
  }

  function initFirebaseSync() {
    if (!dbRef) return;
    dbRef.on(
      "value",
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          hasRemoteData = true;
          const nextConfig = mergeDefaults(deepClone(DEFAULT_CONFIG), data);
          if (JSON.stringify(nextConfig) !== JSON.stringify(config)) {
            config = nextConfig;
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
            } catch {}
            renderAll();
            if (isAdminUnlocked && !document.activeElement?.closest("#admin-dashboard-modal")) {
              populateAdminFields();
            }
          }
        }
      },
      (err) => {
        console.error("Firebase Read Error:", err);
      }
    );
  }

  // ---------- Helpers ----------
  function escapeHtml(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function formatHeadline(raw) {
    const escaped = escapeHtml(raw);
    return escaped.replace(/\*([^*]+)\*/g, '<span class="gradient-text">$1</span>');
  }

  function extractYouTubeId(url) {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([A-Za-z0-9_-]{11})/,
      /[?&]v=([A-Za-z0-9_-]{11})/
    ];
    for (const re of patterns) {
      const m = url.match(re);
      if (m) return m[1];
    }
    return null;
  }

  function extractDriveId(url) {
    const patterns = [
      /drive\.google\.com\/file\/d\/([A-Za-z0-9_-]+)/,
      /drive\.google\.com\/(?:open|uc)\?id=([A-Za-z0-9_-]+)/
    ];
    for (const re of patterns) {
      const m = url.match(re);
      if (m) return m[1];
    }
    return null;
  }

  function parseVideoSource(rawUrl) {
    const url = (rawUrl || "").trim();
    const ytId = extractYouTubeId(url);
    if (ytId) {
      return {
        type: "iframe",
        src: `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`,
        badge: "YOUTUBE",
        autoThumb: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
      };
    }

    const driveId = extractDriveId(url);
    if (driveId) {
      return {
        type: "iframe",
        src: `https://drive.google.com/file/d/${driveId}/preview`,
        badge: "GOOGLE DRIVE",
        autoThumb: ""
      };
    }

    return {
      type: "video",
      src: url,
      badge: "MP4 STREAM",
      autoThumb: ""
    };
  }

  function sanitizePhoneDigits(num) {
    return String(num || "").replace(/\D/g, "");
  }

  function buildWhatsAppBase() {
    const cc = sanitizePhoneDigits(config.contact.countryCode) || "91";
    const num = sanitizePhoneDigits(config.contact.phone);
    if (!num) return "https://wa.me/";
    const full = num.length === 10 ? `${cc}${num}` : num;
    return `https://wa.me/${full}`;
  }

  function buildTelHref() {
    const cc = sanitizePhoneDigits(config.contact.countryCode) || "91";
    const num = sanitizePhoneDigits(config.contact.phone);
    if (!num) return "tel:";
    const full = num.length === 10 ? `+${cc}${num}` : `+${num}`;
    return `tel:${full}`;
  }

  function showToast(msg) {
    const toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.classList.remove("hidden");
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.add("hidden"), 2800);
  }

  // ---------- Software Icons ----------
  function getSoftwareSvg(preset) {
    switch (preset) {
      case "davinci":
        return `
          <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <circle cx="16" cy="8.5" r="5" stroke="#22D3EE" stroke-width="2.2"/>
            <circle cx="9.5" cy="21" r="5" stroke="#F59E0B" stroke-width="2.2"/>
            <circle cx="22.5" cy="21" r="5" stroke="#A855F7" stroke-width="2.2"/>
            <circle cx="16" cy="16" r="2.2" fill="#F8FAFC"/>
          </svg>`;
      case "aftereffects":
        return `
          <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <rect x="3" y="3" width="26" height="26" rx="6" fill="rgba(147,51,234,0.18)" stroke="#A855F7" stroke-width="2"/>
            <text x="16" y="20.5" text-anchor="middle" fill="#E9D5FF" font-family="Outfit, sans-serif" font-weight="800" font-size="13">Ae</text>
          </svg>`;
      case "premiere":
        return `
          <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <rect x="3" y="3" width="26" height="26" rx="6" fill="rgba(99,102,241,0.18)" stroke="#818CF8" stroke-width="2"/>
            <text x="16" y="20.5" text-anchor="middle" fill="#E0E7FF" font-family="Outfit, sans-serif" font-weight="800" font-size="13">Pr</text>
          </svg>`;
      case "blender":
        return `
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
            <line x1="12" y1="22.08" x2="12" y2="12"/>
          </svg>`;
      case "audio":
        return `
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#22D3EE" stroke-width="2" stroke-linecap="round" aria-hidden="true">
            <path d="M2 12h2M6 8v8M10 4v16M14 7v10M18 9v6M22 12h-2"/>
          </svg>`;
      default:
        return `
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#A855F7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
          </svg>`;
    }
  }

  // ---------- Rendering ----------
  function applyTheme() {
    const root = document.documentElement;
    root.style.setProperty("--accent", config.theme.accent);
    root.style.setProperty("--accent-secondary", config.theme.secondary);
    root.style.setProperty("--glow-tint", config.theme.glow);

    const fontMap = {
      "Plus Jakarta Sans": "'Plus Jakarta Sans', 'Inter', sans-serif",
      Inter: "'Inter', 'Plus Jakarta Sans', sans-serif",
      Outfit: "'Outfit', 'Plus Jakarta Sans', sans-serif"
    };
    root.style.setProperty("--font-heading", fontMap[config.theme.headingFont] || "'Plus Jakarta Sans', 'Inter', sans-serif");
  }

  function renderBrandAndHero() {
    document.title = `${config.brand.name} — Video Editing & VFX Portfolio`;
    document.getElementById("nav-brand-name").textContent = config.brand.name;
    document.getElementById("footer-brand-name").textContent = config.brand.name;
    document.getElementById("hero-badge-text").textContent = config.brand.heroBadge;
    document.getElementById("hero-headline").innerHTML = formatHeadline(config.brand.heroHeadline);
    document.getElementById("hero-tagline").textContent = config.brand.heroTagline;
    document.getElementById("hero-bio").textContent = config.brand.heroBio;
    document.getElementById("hero-exp-inline").textContent = `${config.brand.expYears} YRS PRO EXPERIENCE`;

    // Showreel
    document.getElementById("showreel-title").textContent = config.brand.reelTitle;
    document.getElementById("showreel-duration").textContent = config.brand.reelDuration;
    const parsedReel = parseVideoSource(config.brand.reelUrl);
    const thumbImg = document.getElementById("showreel-thumb");
    const chosenThumb = config.brand.reelThumb || parsedReel.autoThumb || "frames/ezgif-frame-002.jpg";
    thumbImg.src = chosenThumb;
    thumbImg.onerror = () => {
      thumbImg.style.opacity = "0";
    };
    thumbImg.onload = () => {
      thumbImg.style.opacity = "1";
    };

    // Experience
    document.getElementById("exp-years-display").textContent = config.brand.expYears;
    document.getElementById("exp-label-display").textContent = config.brand.expLabel;
    document.getElementById("exp-subtext-display").textContent = config.brand.expSubtext;

    const statsGrid = document.getElementById("exp-stats-grid");
    statsGrid.innerHTML = config.stats
      .map(
        (st, idx) => `
      <div class="stat-badge">
        <div class="stat-value" data-stat-index="${idx}">${escapeHtml(st.value)}</div>
        <div class="stat-label">${escapeHtml(st.label)}</div>
      </div>`
      )
      .join("");
  }

  function renderCategoryFilters() {
    const container = document.getElementById("category-filters");
    container.innerHTML = CATEGORIES.map(
      (cat) => `
      <button
        type="button"
        class="filter-pill ${cat === activeCategory ? "active" : ""}"
        data-category="${escapeHtml(cat)}"
        role="tab"
        aria-selected="${cat === activeCategory}"
      >${escapeHtml(cat)}</button>`
    ).join("");

    container.querySelectorAll(".filter-pill").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeCategory = btn.dataset.category;
        renderCategoryFilters();
        renderVideos(true);
      });
    });
  }

  function renderVideos(animateFresh = false) {
    stopAllInlineVideos();
    const grid = document.getElementById("videos-grid");
    const empty = document.getElementById("videos-empty");

    const filtered =
      activeCategory === "All"
        ? config.videos
        : config.videos.filter((v) => v.category.toLowerCase() === activeCategory.toLowerCase());

    if (filtered.length === 0) {
      grid.innerHTML = "";
      empty.classList.remove("hidden");
      return;
    }

    empty.classList.add("hidden");
    grid.innerHTML = filtered
      .map((vid) => {
        const parsed = parseVideoSource(vid.url);
        const thumbSrc = vid.thumb || parsed.autoThumb;
        return `
        <article class="video-card spotlight-card" data-video-id="${escapeHtml(vid.id)}" tabindex="0" role="button" aria-label="Play ${escapeHtml(vid.title)}">
          <div class="video-thumb-wrap">
            <div class="video-thumb-fallback">${escapeHtml(vid.category)} // PLAY</div>
            ${
              thumbSrc
                ? `<img src="${escapeHtml(thumbSrc)}" alt="${escapeHtml(vid.title)}" loading="lazy" onerror="this.remove()" />`
                : ""
            }
            <div class="video-inline-player"></div>
            <div class="video-thumb-gradient"></div>
            <span class="video-cat-badge">${escapeHtml(vid.category)}</span>
            <span class="video-source-badge">${escapeHtml(parsed.badge)}</span>
            <span class="video-playing-tag">● PLAYING // CLICK FOR SOUND</span>
            <div class="video-play-circle" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v14l11-7-11-7z"/></svg>
            </div>
          </div>
          <div class="video-card-body">
            <h3 class="video-card-title">${escapeHtml(vid.title)}</h3>
            <p class="video-card-desc">${escapeHtml(vid.description)}</p>
          </div>
        </article>`;
      })
      .join("");

    grid.querySelectorAll(".video-card").forEach((card) => {
      const open = () => {
        const vid = config.videos.find((v) => v.id === card.dataset.videoId);
        if (vid) openLightbox(vid);
      };
      card.addEventListener("click", open);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      });
    });

    attachSpotlightListeners();
    animateVideoCards(animateFresh);
    requestAnimationFrame(updateScrollAutoPlay);
  }

  function renderSoftware() {
    const grid = document.getElementById("software-grid");
    grid.innerHTML = config.software
      .map(
        (sw) => `
      <div class="software-card glass-card spotlight-card">
        <div class="software-icon-box">${getSoftwareSvg(sw.icon)}</div>
        <div>
          <h3>${escapeHtml(sw.name)}</h3>
          <div class="software-role">${escapeHtml(sw.role)}</div>
        </div>
        <p class="software-desc">${escapeHtml(sw.description || "")}</p>
        <div class="software-tag mono-tag">${escapeHtml(sw.tag || "PRO PIPELINE")}</div>
      </div>`
      )
      .join("");

    attachSpotlightListeners();
  }

  function renderContact() {
    document.getElementById("contact-phone-display").textContent = config.contact.phone;
    document.getElementById("whatsapp-direct-btn").href = buildWhatsAppBase();
    document.getElementById("call-direct-btn").href = buildTelHref();

    const socialHtml = config.contact.socials
      .map(
        (s) =>
          `<a href="${escapeHtml(s.url)}" target="_blank" rel="noopener noreferrer" class="social-chip">${escapeHtml(
            s.label
          )} ↗</a>`
      )
      .join("");

    document.getElementById("contact-socials").innerHTML = socialHtml;
    document.getElementById("footer-socials").innerHTML = socialHtml;
  }

  function renderAll() {
    applyTheme();
    renderBrandAndHero();
    renderCategoryFilters();
    renderVideos(false);
    renderSoftware();
    renderContact();
    document.getElementById("footer-year").textContent = new Date().getFullYear();
  }

  // ---------- Spotlight Mouse Glow ----------
  function attachSpotlightListeners() {
    document.querySelectorAll(".spotlight-card").forEach((card) => {
      if (card.dataset.spotlightBound) return;
      card.dataset.spotlightBound = "1";
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
        card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
      });
    });
  }

  // ---------- Scroll Animations (GSAP + ScrollTrigger + IO Fallback) ----------
  function animateVideoCards(isFilterSwitch = false) {
    const cards = Array.from(document.querySelectorAll("#videos-grid .video-card"));
    if (!cards.length) return;

    if (window.gsap && window.ScrollTrigger) {
      if (isFilterSwitch) {
        gsap.fromTo(
          cards,
          { opacity: 0, scale: 0.9, y: 36, filter: "blur(10px)" },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.55,
            stagger: 0.07,
            ease: "power3.out",
            clearProps: "filter,transform"
          }
        );
      } else {
        cards.forEach((card, i) => {
          gsap.fromTo(
            card,
            { opacity: 0, scale: 0.9, y: 54, filter: "blur(12px)" },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.85,
              delay: (i % 3) * 0.1,
              ease: "power3.out",
              clearProps: "filter,transform",
              scrollTrigger: {
                trigger: card,
                start: "top 90%",
                once: true
              }
            }
          );

          const thumbImg = card.querySelector(".video-thumb-wrap img");
          if (thumbImg) {
            gsap.to(thumbImg, {
              yPercent: -6,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: true
              }
            });
          }
        });
        ScrollTrigger.refresh();
      }
      return;
    }

    if (videoObserver) videoObserver.disconnect();
    videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("io-hidden");
            entry.target.classList.add("io-visible");
            videoObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    cards.forEach((card, i) => {
      card.style.transitionDelay = `${(i % 3) * 80}ms`;
      card.classList.add("io-hidden");
      videoObserver.observe(card);
    });
  }

  function initPageAnimations() {
    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);

      gsap.from(".hero-reveal", {
        y: 32,
        opacity: 0,
        filter: "blur(8px)",
        duration: 0.85,
        stagger: 0.1,
        ease: "power3.out",
        clearProps: "filter,transform"
      });

      document.querySelectorAll(".scroll-reveal-block").forEach((block) => {
        gsap.from(block, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          clearProps: "transform",
          scrollTrigger: {
            trigger: block,
            start: "top 86%",
            once: true
          }
        });
      });

      gsap.from(".software-card", {
        y: 38,
        scale: 0.94,
        opacity: 0,
        duration: 0.75,
        stagger: 0.12,
        ease: "power3.out",
        clearProps: "transform",
        scrollTrigger: {
          trigger: "#software-grid",
          start: "top 86%",
          once: true
        }
      });

      ScrollTrigger.create({
        trigger: "#experience",
        start: "top 82%",
        once: true,
        onEnter: runStatCounters
      });
    } else {
      runStatCounters();
    }
  }

  function runStatCounters() {
    const expEl = document.getElementById("exp-years-display");
    const raw = config.brand.expYears;
    const match = raw.match(/^(\d+)(.*)$/);
    if (match) {
      const target = parseInt(match[1], 10);
      const suffix = match[2] || "";
      animateNumber(expEl, target, suffix, 900);
    }

    document.querySelectorAll("[data-stat-index]").forEach((el) => {
      const st = config.stats[Number(el.dataset.statIndex)];
      if (!st) return;
      const m = st.value.match(/^(\d+)(.*)$/);
      if (m) {
        animateNumber(el, parseInt(m[1], 10), m[2] || "", 1100);
      }
    });
  }

  function animateNumber(el, target, suffix, duration) {
    const start = performance.now();
    function step(now) {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = `${Math.round(target * eased)}${suffix}`;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // ---------- Scroll Auto-Play (One Active Video at a Time) ----------
  let activeAutoPlayEl = null;
  let scrollAutoPlayTicking = false;

  function buildInlinePreviewHtml(rawUrl, title) {
    const url = (rawUrl || "").trim();
    const ytId = extractYouTubeId(url);
    if (ytId) {
      const embedUrl = `https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&modestbranding=1&rel=0&playsinline=1`;
      return `<iframe src="${escapeHtml(embedUrl)}" allow="autoplay; encrypted-media" tabindex="-1" title="${escapeHtml(title)}"></iframe>`;
    }

    const driveId = extractDriveId(url);
    if (driveId) {
      return `<iframe src="https://drive.google.com/file/d/${driveId}/preview" allow="autoplay" tabindex="-1" title="${escapeHtml(title)}"></iframe>`;
    }

    return `<video src="${escapeHtml(url)}" muted autoplay loop playsinline></video>`;
  }

  function stopInlineVideo(el) {
    if (!el) return;
    el.classList.remove("is-playing");
    const slot = el.querySelector(".video-inline-player, .showreel-inline-player");
    if (slot) slot.innerHTML = "";
    if (activeAutoPlayEl === el) activeAutoPlayEl = null;
  }

  function stopAllInlineVideos() {
    document.querySelectorAll(".is-playing").forEach((el) => stopInlineVideo(el));
    activeAutoPlayEl = null;
  }

  function startInlineVideo(el) {
    if (!el || activeAutoPlayEl === el) return;
    if (activeAutoPlayEl) stopInlineVideo(activeAutoPlayEl);

    let videoUrl = "";
    let videoTitle = "";
    let slot = null;

    if (el.id === "showreel-trigger") {
      videoUrl = config.brand.reelUrl;
      videoTitle = config.brand.reelTitle;
      const mediaBox = el.querySelector(".showreel-media");
      if (mediaBox && !mediaBox.querySelector(".showreel-inline-player")) {
        const div = document.createElement("div");
        div.className = "showreel-inline-player";
        mediaBox.insertBefore(div, mediaBox.querySelector(".showreel-overlay"));
      }
      slot = el.querySelector(".showreel-inline-player");
    } else {
      const vid = config.videos.find((v) => v.id === el.dataset.videoId);
      if (!vid) return;
      videoUrl = vid.url;
      videoTitle = vid.title;
      slot = el.querySelector(".video-inline-player");
    }

    if (!slot || !videoUrl) return;
    slot.innerHTML = buildInlinePreviewHtml(videoUrl, videoTitle);
    el.classList.add("is-playing");
    activeAutoPlayEl = el;
  }

  function updateScrollAutoPlay() {
    scrollAutoPlayTicking = false;
    const lightbox = document.getElementById("lightbox-modal");
    const adminModal = document.getElementById("admin-dashboard-modal");
    if ((lightbox && !lightbox.classList.contains("hidden")) || (adminModal && !adminModal.classList.contains("hidden"))) {
      return;
    }

    const candidates = [];
    const reelEl = document.getElementById("showreel-trigger");
    if (reelEl) candidates.push(reelEl);
    document.querySelectorAll("#videos-grid .video-card").forEach((c) => candidates.push(c));

    const vh = window.innerHeight;
    const viewportCenter = vh * 0.5;
    let bestEl = null;
    let bestDistance = Infinity;

    candidates.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const visibleHeight = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
      const ratio = rect.height > 0 ? visibleHeight / rect.height : 0;

      if (ratio >= 0.5) {
        const cardCenter = rect.top + rect.height * 0.5;
        const dist = Math.abs(cardCenter - viewportCenter);
        if (dist < bestDistance) {
          bestDistance = dist;
          bestEl = el;
        }
      }
    });

    if (bestEl) {
      startInlineVideo(bestEl);
    } else if (activeAutoPlayEl) {
      stopInlineVideo(activeAutoPlayEl);
    }
  }

  function initScrollAutoPlay() {
    const onScrollOrResize = () => {
      if (!scrollAutoPlayTicking) {
        scrollAutoPlayTicking = true;
        requestAnimationFrame(updateScrollAutoPlay);
      }
    };
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });
    setTimeout(updateScrollAutoPlay, 400);
  }

  // ---------- Lightbox Player ----------
  function openLightbox(video) {
    stopAllInlineVideos();
    const modal = document.getElementById("lightbox-modal");
    const frame = document.getElementById("lightbox-player-frame");
    const parsed = parseVideoSource(video.url);

    document.getElementById("lightbox-category").textContent = video.category;
    document.getElementById("lightbox-title").textContent = video.title;
    document.getElementById("lightbox-desc").textContent = video.description || "";

    if (parsed.type === "iframe") {
      frame.innerHTML = `<iframe src="${escapeHtml(
        parsed.src
      )}" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowfullscreen title="${escapeHtml(
        video.title
      )}"></iframe>`;
    } else {
      frame.innerHTML = `<video src="${escapeHtml(parsed.src)}" controls autoplay playsinline></video>`;
    }

    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    const modal = document.getElementById("lightbox-modal");
    if (modal.classList.contains("hidden")) return;
    document.getElementById("lightbox-player-frame").innerHTML = "";
    modal.classList.add("hidden");
    document.body.style.overflow = "";
    requestAnimationFrame(updateScrollAutoPlay);
  }

  // ---------- Admin Panel & Auth ----------
  function openAdminFlow() {
    if (isAdminUnlocked) {
      openAdminDashboard();
      return;
    }
    const loginModal = document.getElementById("admin-login-modal");
    const input = document.getElementById("admin-password-input");
    const err = document.getElementById("login-error");
    err.classList.add("hidden");
    input.value = "";
    loginModal.classList.remove("hidden");
    setTimeout(() => input.focus(), 40);
  }

  function closeLoginModal() {
    document.getElementById("admin-login-modal").classList.add("hidden");
  }

  function openAdminDashboard() {
    stopAllInlineVideos();
    populateAdminFields();
    document.getElementById("admin-dashboard-modal").classList.remove("hidden");
    document.body.style.overflow = "hidden";
    if (dbRef && !hasRemoteData) {
      saveConfig(true);
    }
  }

  function closeAdminDashboard() {
    document.getElementById("admin-dashboard-modal").classList.add("hidden");
    document.body.style.overflow = "";
    requestAnimationFrame(updateScrollAutoPlay);
  }

  function populateAdminFields() {
    document.getElementById("adm-brand-name").value = config.brand.name;
    document.getElementById("adm-hero-badge").value = config.brand.heroBadge;
    document.getElementById("adm-hero-headline").value = config.brand.heroHeadline;
    document.getElementById("adm-hero-tagline").value = config.brand.heroTagline;
    document.getElementById("adm-hero-bio").value = config.brand.heroBio;
    document.getElementById("adm-exp-years").value = config.brand.expYears;
    document.getElementById("adm-exp-label").value = config.brand.expLabel;
    document.getElementById("adm-exp-subtext").value = config.brand.expSubtext;
    document.getElementById("adm-reel-title").value = config.brand.reelTitle;
    document.getElementById("adm-reel-duration").value = config.brand.reelDuration;
    document.getElementById("adm-reel-url").value = config.brand.reelUrl;
    document.getElementById("adm-reel-thumb").value = config.brand.reelThumb || "";

    syncThemeInputs();

    document.getElementById("adm-phone").value = config.contact.phone;
    document.getElementById("adm-country-code").value = config.contact.countryCode;

    renderAdminVideoList();
    renderAdminSoftwareList();
    renderAdminSocialList();
  }

  function syncThemeInputs() {
    document.getElementById("adm-accent-color").value = config.theme.accent;
    document.getElementById("adm-accent-hex").value = config.theme.accent;
    document.getElementById("adm-secondary-color").value = config.theme.secondary;
    document.getElementById("adm-secondary-hex").value = config.theme.secondary;
    document.getElementById("adm-glow-color").value = config.theme.glow;
    document.getElementById("adm-glow-hex").value = config.theme.glow;
    document.getElementById("adm-heading-font").value = config.theme.headingFont;
  }

  function renderAdminVideoList() {
    const list = document.getElementById("adm-video-list");
    if (!config.videos.length) {
      list.innerHTML = '<p class="mono-tag">No videos added yet.</p>';
      return;
    }

    list.innerHTML = config.videos
      .map(
        (v, idx) => `
      <div class="admin-list-item">
        <div class="admin-item-info">
          <strong>${escapeHtml(v.title)} <span class="mono-tag">[${escapeHtml(v.category)}]</span></strong>
          <span>${escapeHtml(v.url)}</span>
        </div>
        <div class="admin-item-actions">
          <button type="button" class="icon-btn-xs" data-v-act="up" data-idx="${idx}" ${idx === 0 ? "disabled" : ""}>↑</button>
          <button type="button" class="icon-btn-xs" data-v-act="down" data-idx="${idx}" ${
          idx === config.videos.length - 1 ? "disabled" : ""
        }>↓</button>
          <button type="button" class="icon-btn-xs" data-v-act="edit" data-idx="${idx}">Edit</button>
          <button type="button" class="icon-btn-xs danger" data-v-act="del" data-idx="${idx}">Delete</button>
        </div>
      </div>`
      )
      .join("");

    list.querySelectorAll("[data-v-act]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.dataset.idx);
        const act = btn.dataset.vAct;
        if (act === "up" && idx > 0) {
          [config.videos[idx - 1], config.videos[idx]] = [config.videos[idx], config.videos[idx - 1]];
        } else if (act === "down" && idx < config.videos.length - 1) {
          [config.videos[idx + 1], config.videos[idx]] = [config.videos[idx], config.videos[idx + 1]];
        } else if (act === "del") {
          config.videos.splice(idx, 1);
        } else if (act === "edit") {
          const v = config.videos[idx];
          document.getElementById("adm-video-edit-id").value = v.id;
          document.getElementById("adm-vid-title").value = v.title;
          document.getElementById("adm-vid-cat").value = v.category;
          document.getElementById("adm-vid-url").value = v.url;
          document.getElementById("adm-vid-thumb").value = v.thumb || "";
          document.getElementById("adm-vid-desc").value = v.description || "";
          document.getElementById("adm-video-form-title").textContent = "Edit Video";
          document.getElementById("adm-vid-submit-btn").textContent = "Update Video";
          document.getElementById("adm-vid-cancel-btn").classList.remove("hidden");
          return;
        }
        saveConfig();
        renderVideos(false);
        renderAdminVideoList();
      });
    });
  }

  function renderAdminSoftwareList() {
    const list = document.getElementById("adm-software-list");
    list.innerHTML = config.software
      .map(
        (sw, idx) => `
      <div class="admin-list-item">
        <div class="admin-item-info">
          <strong>${escapeHtml(sw.name)}</strong>
          <span>${escapeHtml(sw.role)} — ${escapeHtml(sw.tag || "")}</span>
        </div>
        <div class="admin-item-actions">
          <button type="button" class="icon-btn-xs" data-sw-act="edit" data-idx="${idx}">Edit</button>
          <button type="button" class="icon-btn-xs danger" data-sw-act="del" data-idx="${idx}">Remove</button>
        </div>
      </div>`
      )
      .join("");

    list.querySelectorAll("[data-sw-act]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.dataset.idx);
        const act = btn.dataset.swAct;
        if (act === "del") {
          config.software.splice(idx, 1);
          saveConfig();
          renderSoftware();
          renderAdminSoftwareList();
        } else if (act === "edit") {
          const sw = config.software[idx];
          document.getElementById("adm-sw-edit-id").value = sw.id;
          document.getElementById("adm-sw-name").value = sw.name;
          document.getElementById("adm-sw-role").value = sw.role;
          document.getElementById("adm-sw-icon").value = sw.icon || "sparkles";
          document.getElementById("adm-sw-tag").value = sw.tag || "";
          document.getElementById("adm-sw-desc").value = sw.description || "";
          document.getElementById("adm-sw-form-title").textContent = "Edit Software Skill";
          document.getElementById("adm-sw-submit-btn").textContent = "Update Software";
          document.getElementById("adm-sw-cancel-btn").classList.remove("hidden");
        }
      });
    });
  }

  function renderAdminSocialList() {
    const list = document.getElementById("adm-social-list");
    list.innerHTML = config.contact.socials
      .map(
        (s, idx) => `
      <div class="admin-list-item">
        <div class="admin-item-info">
          <strong>${escapeHtml(s.label)}</strong>
          <span>${escapeHtml(s.url)}</span>
        </div>
        <div class="admin-item-actions">
          <button type="button" class="icon-btn-xs danger" data-soc-del="${idx}">Remove</button>
        </div>
      </div>`
      )
      .join("");

    list.querySelectorAll("[data-soc-del]").forEach((btn) => {
      btn.addEventListener("click", () => {
        config.contact.socials.splice(Number(btn.dataset.socDel), 1);
        saveConfig();
        renderContact();
        renderAdminSocialList();
      });
    });
  }

  function bindAdminEvents() {
    document.getElementById("admin-lock-btn").addEventListener("click", openAdminFlow);
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        openAdminFlow();
      } else if (e.key === "Escape") {
        closeLightbox();
        closeLoginModal();
      }
    });

    document.getElementById("login-close-btn").addEventListener("click", closeLoginModal);
    document.getElementById("admin-login-modal").addEventListener("click", (e) => {
      if (e.target.id === "admin-login-modal") closeLoginModal();
    });

    document.getElementById("admin-login-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const input = document.getElementById("admin-password-input");
      const err = document.getElementById("login-error");
      if (input.value === ADMIN_PASS) {
        isAdminUnlocked = true;
        closeLoginModal();
        openAdminDashboard();
        showToast("Admin Dashboard unlocked");
      } else {
        err.classList.remove("hidden");
        const card = document.querySelector(".login-card");
        card.classList.remove("shake");
        void card.offsetWidth;
        card.classList.add("shake");
      }
    });

    document.getElementById("admin-close-btn").addEventListener("click", closeAdminDashboard);
    document.getElementById("admin-done-btn").addEventListener("click", closeAdminDashboard);

    document.querySelectorAll(".admin-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        document.querySelectorAll(".admin-tab").forEach((t) => t.classList.remove("active"));
        document.querySelectorAll(".admin-tab-pane").forEach((p) => p.classList.remove("active"));
        tab.classList.add("active");
        document.getElementById(`tab-${tab.dataset.tab}`).classList.add("active");
      });
    });

    const brandBindings = [
      ["adm-brand-name", "name"],
      ["adm-hero-badge", "heroBadge"],
      ["adm-hero-headline", "heroHeadline"],
      ["adm-hero-tagline", "heroTagline"],
      ["adm-hero-bio", "heroBio"],
      ["adm-exp-years", "expYears"],
      ["adm-exp-label", "expLabel"],
      ["adm-exp-subtext", "expSubtext"],
      ["adm-reel-title", "reelTitle"],
      ["adm-reel-duration", "reelDuration"],
      ["adm-reel-url", "reelUrl"],
      ["adm-reel-thumb", "reelThumb"]
    ];
    brandBindings.forEach(([id, key]) => {
      document.getElementById(id).addEventListener("input", (e) => {
        config.brand[key] = e.target.value;
        saveConfig();
        renderBrandAndHero();
      });
    });

    function bindColorPair(pickerId, hexId, key) {
      const picker = document.getElementById(pickerId);
      const hex = document.getElementById(hexId);
      picker.addEventListener("input", (e) => {
        config.theme[key] = e.target.value;
        hex.value = e.target.value;
        saveConfig();
        applyTheme();
      });
      hex.addEventListener("input", (e) => {
        if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
          config.theme[key] = e.target.value;
          picker.value = e.target.value;
          saveConfig();
          applyTheme();
        }
      });
    }
    bindColorPair("adm-accent-color", "adm-accent-hex", "accent");
    bindColorPair("adm-secondary-color", "adm-secondary-hex", "secondary");
    bindColorPair("adm-glow-color", "adm-glow-hex", "glow");

    document.querySelectorAll(".preset-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        config.theme.accent = chip.dataset.accent;
        config.theme.secondary = chip.dataset.secondary;
        config.theme.glow = chip.dataset.glow;
        syncThemeInputs();
        saveConfig();
        applyTheme();
      });
    });

    document.getElementById("adm-heading-font").addEventListener("change", (e) => {
      config.theme.headingFont = e.target.value;
      saveConfig();
      applyTheme();
    });

    function resetVideoForm() {
      document.getElementById("adm-video-form").reset();
      document.getElementById("adm-video-edit-id").value = "";
      document.getElementById("adm-video-form-title").textContent = "Add New Video";
      document.getElementById("adm-vid-submit-btn").textContent = "Add Video";
      document.getElementById("adm-vid-cancel-btn").classList.add("hidden");
    }
    document.getElementById("adm-vid-cancel-btn").addEventListener("click", resetVideoForm);

    document.getElementById("adm-video-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const editId = document.getElementById("adm-video-edit-id").value;
      const item = {
        id: editId || `vid-${Date.now()}`,
        title: document.getElementById("adm-vid-title").value.trim(),
        category: document.getElementById("adm-vid-cat").value,
        url: document.getElementById("adm-vid-url").value.trim(),
        thumb: document.getElementById("adm-vid-thumb").value.trim(),
        description: document.getElementById("adm-vid-desc").value.trim()
      };

      if (editId) {
        const idx = config.videos.findIndex((v) => v.id === editId);
        if (idx !== -1) config.videos[idx] = item;
        showToast("Video updated");
      } else {
        config.videos.unshift(item);
        showToast("Video added & synced live");
      }

      resetVideoForm();
      saveConfig();
      renderVideos(false);
      renderAdminVideoList();
    });

    function resetSoftwareForm() {
      document.getElementById("adm-software-form").reset();
      document.getElementById("adm-sw-edit-id").value = "";
      document.getElementById("adm-sw-form-title").textContent = "Add Software Skill";
      document.getElementById("adm-sw-submit-btn").textContent = "Add Software";
      document.getElementById("adm-sw-cancel-btn").classList.add("hidden");
    }
    document.getElementById("adm-sw-cancel-btn").addEventListener("click", resetSoftwareForm);

    document.getElementById("adm-software-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const editId = document.getElementById("adm-sw-edit-id").value;
      const item = {
        id: editId || `sw-${Date.now()}`,
        name: document.getElementById("adm-sw-name").value.trim(),
        role: document.getElementById("adm-sw-role").value.trim(),
        icon: document.getElementById("adm-sw-icon").value,
        tag: document.getElementById("adm-sw-tag").value.trim(),
        description: document.getElementById("adm-sw-desc").value.trim()
      };

      if (editId) {
        const idx = config.software.findIndex((s) => s.id === editId);
        if (idx !== -1) config.software[idx] = item;
        showToast("Software skill updated");
      } else {
        config.software.push(item);
        showToast("Software skill added");
      }

      resetSoftwareForm();
      saveConfig();
      renderSoftware();
      renderAdminSoftwareList();
    });

    document.getElementById("adm-phone").addEventListener("input", (e) => {
      config.contact.phone = e.target.value;
      saveConfig();
      renderContact();
    });
    document.getElementById("adm-country-code").addEventListener("input", (e) => {
      config.contact.countryCode = e.target.value;
      saveConfig();
      renderContact();
    });

    document.getElementById("adm-social-form").addEventListener("submit", (e) => {
      e.preventDefault();
      config.contact.socials.push({
        id: `soc-${Date.now()}`,
        label: document.getElementById("adm-soc-label").value.trim(),
        url: document.getElementById("adm-soc-url").value.trim()
      });
      e.target.reset();
      saveConfig();
      renderContact();
      renderAdminSocialList();
    });

    document.getElementById("export-config-btn").addEventListener("click", () => {
      const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "aura-edits-config.json";
      a.click();
      URL.revokeObjectURL(url);
      showToast("Config exported as JSON");
    });

    document.getElementById("import-config-input").addEventListener("change", (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const imported = JSON.parse(String(reader.result));
          config = mergeDefaults(deepClone(DEFAULT_CONFIG), imported);
          saveConfig();
          renderAll();
          populateAdminFields();
          showToast("Config imported & synced to Firebase");
        } catch {
          showToast("Invalid JSON config file");
        }
      };
      reader.readAsText(file);
      e.target.value = "";
    });

    document.getElementById("reset-config-btn").addEventListener("click", () => {
      if (!window.confirm("Reset all portfolio settings and edits back to defaults?")) return;
      config = deepClone(DEFAULT_CONFIG);
      saveConfig();
      renderAll();
      populateAdminFields();
      showToast("Portfolio reset to defaults");
    });
  }

  // ---------- General UI Events ----------
  function bindUiEvents() {
    const header = document.querySelector(".site-header");
    window.addEventListener(
      "scroll",
      () => {
        header.classList.toggle("scrolled", window.scrollY > 24);
      },
      { passive: true }
    );

    const menuBtn = document.getElementById("mobile-menu-btn");
    const navLinks = document.getElementById("nav-links");
    menuBtn.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    navLinks.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });

    const reelTrigger = document.getElementById("showreel-trigger");
    const openReel = () =>
      openLightbox({
        title: config.brand.reelTitle,
        category: "SHOWREEL",
        url: config.brand.reelUrl,
        description: `${config.brand.name} — Signature Showreel (${config.brand.reelDuration})`
      });
    reelTrigger.addEventListener("click", openReel);
    reelTrigger.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openReel();
      }
    });

    document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
    document.getElementById("lightbox-book-btn").addEventListener("click", closeLightbox);
    document.getElementById("lightbox-modal").addEventListener("click", (e) => {
      if (e.target.id === "lightbox-modal") closeLightbox();
    });

    document.getElementById("inquiry-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("inq-name").value.trim();
      const category = document.getElementById("inq-category").value;
      const timeline = document.getElementById("inq-timeline").value.trim();
      const details = document.getElementById("inq-message").value.trim();

      const lines = [
        `Hi ${config.brand.name}! I'd like to book an edit.`,
        ``,
        `*Name:* ${name}`,
        `*Category:* ${category}`,
        timeline ? `*Timeline / Budget:* ${timeline}` : null,
        `*Project Brief:* ${details}`
      ].filter((l) => l !== null);

      const waUrl = `${buildWhatsAppBase()}?text=${encodeURIComponent(lines.join("\n"))}`;
      window.open(waUrl, "_blank", "noopener,noreferrer");
    });
  }

  // ---------- Background Scroll Photo-Frame Animation ----------
  function initBackgroundScrollFrames() {
    const canvas = document.getElementById("bg-scroll-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const START_FRAME = 2;
    const END_FRAME = 238;
    const TOTAL_FRAMES = END_FRAME - START_FRAME + 1;
    const frames = new Array(TOTAL_FRAMES);
    const ready = new Uint8Array(TOTAL_FRAMES);

    let width = 0;
    let height = 0;
    let dpr = 1;
    let targetIndex = 0;
    let currentIndex = 0;
    let lastDrawnA = -1;
    let lastDrawnB = -1;
    let lastAlpha = -1;
    let lastTime = performance.now();

    function frameUrl(index) {
      const num = String(START_FRAME + index).padStart(3, "0");
      return `frames/ezgif-frame-${num}.jpg`;
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      lastDrawnA = -1;
      updateTargetFromScroll();
    }

    function drawFrameLayer(img, alpha, mode) {
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      if (!iw || !ih) return;

      const scale = mode === "cover" ? Math.max(width / iw, height / ih) : Math.min(width / iw, height / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = (width - dw) * 0.5;
      const dy = mode === "cover" ? (height - dh) * 0.32 : (height - dh) * 0.5;

      ctx.globalAlpha = alpha;
      ctx.drawImage(img, dx, dy, dw, dh);
    }

    function findNearestReady(index) {
      if (ready[index]) return index;
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        const prev = index - offset;
        if (prev >= 0 && ready[prev]) return prev;
        const next = index + offset;
        if (next < TOTAL_FRAMES && ready[next]) return next;
      }
      return -1;
    }

    function updateTargetFromScroll() {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
      targetIndex = progress * (TOTAL_FRAMES - 1);
    }

    function render(now) {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const smoothing = 1 - Math.exp(-12 * dt);
      const diff = targetIndex - currentIndex;
      if (Math.abs(diff) < 0.0005) {
        currentIndex = targetIndex;
      } else {
        currentIndex += diff * smoothing;
      }

      const clamped = Math.min(TOTAL_FRAMES - 1, Math.max(0, currentIndex));
      const indexA = Math.floor(clamped);
      const indexB = Math.min(TOTAL_FRAMES - 1, indexA + 1);
      const frac = clamped - indexA;

      const drawA = findNearestReady(indexA);
      const drawB = frac > 0.01 && ready[indexB] ? indexB : -1;
      const quantAlpha = drawB !== -1 ? Math.round(frac * 100) / 100 : 0;

      if (drawA !== -1 && (drawA !== lastDrawnA || drawB !== lastDrawnB || quantAlpha !== lastAlpha)) {
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#07070A";
        ctx.fillRect(0, 0, width, height);

        drawFrameLayer(frames[drawA], 0.24, "cover");
        drawFrameLayer(frames[drawA], 0.94, "contain");
        if (drawB !== -1 && drawB !== drawA && quantAlpha > 0) {
          drawFrameLayer(frames[drawB], 0.24 * quantAlpha, "cover");
          drawFrameLayer(frames[drawB], 0.94 * quantAlpha, "contain");
        }
        ctx.globalAlpha = 1;

        lastDrawnA = drawA;
        lastDrawnB = drawB;
        lastAlpha = quantAlpha;
      }

      requestAnimationFrame(render);
    }

    function loadFrame(index) {
      return new Promise((resolve) => {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => {
          frames[index] = img;
          ready[index] = 1;
          if (index === 0) lastDrawnA = -1;
          resolve();
        };
        img.onerror = () => resolve();
        img.src = frameUrl(index);
      });
    }

    async function preloadFrames() {
      await loadFrame(0);
      const queue = [];
      for (let i = 1; i < TOTAL_FRAMES; i++) queue.push(i);

      const CONCURRENCY = 6;
      const workers = Array.from({ length: CONCURRENCY }, async () => {
        while (queue.length > 0) {
          const next = queue.shift();
          if (next !== undefined) await loadFrame(next);
        }
      });
      await Promise.all(workers);
    }

    resize();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("scroll", updateTargetFromScroll, { passive: true });
    preloadFrames();
    requestAnimationFrame(render);
  }

  // ---------- Init ----------
  document.addEventListener("DOMContentLoaded", () => {
    renderAll();
    initFirebaseSync();
    bindUiEvents();
    bindAdminEvents();
    initPageAnimations();
    initBackgroundScrollFrames();
    initScrollAutoPlay();
  });
})();
