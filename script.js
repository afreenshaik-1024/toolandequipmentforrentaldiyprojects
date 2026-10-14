/* =========================================================
   TOOLNEST - COMPLETE JAVASCRIPT
   Includes: navbar, dropdown, mobile menu, theme, RTL,
   FAQ accordion, gallery lightboxes, dashboard demo.
   Frontend demo only; dashboard data is not connected to a backend.
========================================================= */

(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  /* ---------- NAVBAR ELEMENTS ---------- */
  const homeDropdown = $("#homeDropdown");
  const dropdownMenu = $("#homeDropdownMenu");
  const navMenu = $("#navMenu");
  const mobileMenuBtn = $("#mobileMenuBtn");
  const themeToggle = $("#themeToggle");
  const themeIcon = $("#themeIcon");
  const rtlToggle = $("#rtlToggle");

  /* ---------- THEME: SINGLE SOURCE OF TRUTH ---------- */
  function applyTheme(theme, save = true) {
    const selectedTheme = theme === "dark" ? "dark" : "light";

    document.documentElement.setAttribute("data-theme", selectedTheme);
    document.body.classList.toggle("dark-mode", selectedTheme === "dark");
    document.body.classList.toggle("light-mode", selectedTheme === "light");

    if (themeIcon) {
      themeIcon.className = selectedTheme === "dark"
        ? "fa-solid fa-sun"
        : "fa-solid fa-moon";
    }

    if (themeToggle) {
      themeToggle.setAttribute(
        "aria-label",
        selectedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      );
      themeToggle.setAttribute("aria-pressed", String(selectedTheme === "dark"));
      themeToggle.title = selectedTheme === "dark" ? "Light mode" : "Dark mode";
    }

    // Also updates optional dashboard theme button label/icon.
    const dashboardThemeButton = $("#dashboardThemeToggle");
    if (dashboardThemeButton) {
      dashboardThemeButton.textContent = selectedTheme === "dark" ? "☀" : "◐";
      dashboardThemeButton.setAttribute("aria-pressed", String(selectedTheme === "dark"));
    }

    if (save) {
      try {
        localStorage.setItem("theme", selectedTheme);
      } catch (_) {
        // Theme still works if localStorage is unavailable.
      }
    }
  }

  let savedTheme = "light";
  try {
    savedTheme = localStorage.getItem("theme") || "light";
  } catch (_) {}
  applyTheme(savedTheme, false);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "light";
      applyTheme(current === "dark" ? "light" : "dark");
    });
  }

  /* ---------- HOME DROPDOWN ---------- */
  if (homeDropdown && dropdownMenu) {
    homeDropdown.setAttribute("aria-expanded", "false");
    homeDropdown.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      const open = dropdownMenu.classList.toggle("show");
      homeDropdown.setAttribute("aria-expanded", String(open));
    });
  }

  document.addEventListener("click", event => {
    if (dropdownMenu && !event.target.closest(".dropdown")) {
      dropdownMenu.classList.remove("show");
      homeDropdown?.setAttribute("aria-expanded", "false");
    }
  });

  /* ---------- MOBILE NAVIGATION ---------- */
  function closeMobileMenu() {
    navMenu?.classList.remove("open");
    mobileMenuBtn?.setAttribute("aria-expanded", "false");
    if (mobileMenuBtn) {
      mobileMenuBtn.innerHTML = '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
    }
  }

  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.setAttribute("aria-expanded", "false");
    mobileMenuBtn.addEventListener("click", () => {
      const open = navMenu.classList.toggle("open");
      mobileMenuBtn.setAttribute("aria-expanded", String(open));
      mobileMenuBtn.innerHTML = open
        ? '<i class="fa-solid fa-xmark" aria-hidden="true"></i>'
        : '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
    });

    navMenu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", closeMobileMenu);
    });
  }

  /* ---------- RTL / LTR ---------- */
  if (rtlToggle) {
    rtlToggle.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("dir") || "ltr";
      const next = current === "rtl" ? "ltr" : "rtl";
      document.documentElement.setAttribute("dir", next);
      rtlToggle.setAttribute("aria-pressed", String(next === "rtl"));
      try { localStorage.setItem("direction", next); } catch (_) {}
    });

    try {
      const direction = localStorage.getItem("direction");
      if (direction === "rtl" || direction === "ltr") {
        document.documentElement.setAttribute("dir", direction);
      }
    } catch (_) {}
  }

  /* ---------- ESCAPE KEY ---------- */
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      dropdownMenu?.classList.remove("show");
      homeDropdown?.setAttribute("aria-expanded", "false");
      closeMobileMenu();
      closeGalleryLightbox();
      closeEventLightbox();
    }
  });

  /* ---------- ACTIVE NAV LINK ---------- */
  function setActiveNavigation() {
    const currentPage = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
    const links = $$(".site-header .nav-links a[href]");

    links.forEach(link => {
      const href = link.getAttribute("href") || "";
      const page = href.split("/").pop().split("#")[0].toLowerCase();
      const active = page === currentPage && page !== "";
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });

    const isHome = ["", "index.html", "home.html", "home2.html"].includes(currentPage);
    homeDropdown?.classList.toggle("active", isHome);
  }

  /* ---------- FAQ ACCORDION ---------- */
  function initFAQs() {
    $$(".faq-item").forEach(item => {
      const question = $(".faq-question", item);
      if (!question) return;

      question.setAttribute("aria-expanded", String(item.classList.contains("active")));
      question.addEventListener("click", () => {
        const wasOpen = item.classList.contains("active");
        $$(".faq-item").forEach(faq => {
          faq.classList.remove("active");
          $(".faq-question", faq)?.setAttribute("aria-expanded", "false");
        });
        if (!wasOpen) {
          item.classList.add("active");
          question.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  /* ---------- GALLERY LIGHTBOX ---------- */
  let galleryCurrentIndex = 0;
  let galleryCards = [];
  let galleryLastFocus = null;

  function showGalleryImage(index) {
    const lightbox = $("#galleryLightbox");
    const imageTarget = $("#lightboxImage");
    const caption = $("#lightboxCaption");
    if (!lightbox || !imageTarget || !caption || !galleryCards.length) return;

    galleryCurrentIndex = (index + galleryCards.length) % galleryCards.length;
    const card = galleryCards[galleryCurrentIndex];
    const image = $("img", card);
    if (!image) return;

    imageTarget.src = card.dataset.image || image.currentSrc || image.src;
    imageTarget.alt = image.alt || "";
    caption.textContent = card.dataset.title || image.alt || "";
    const disabled = galleryCards.length < 2;
    const prev = $(".lightbox-prev");
    const next = $(".lightbox-next");
    if (prev) prev.disabled = disabled;
    if (next) next.disabled = disabled;
  }

  function openGalleryLightbox(index) {
    const lightbox = $("#galleryLightbox");
    if (!lightbox) return;
    galleryLastFocus = document.activeElement;
    galleryCards = $$(".gallery-card");
    showGalleryImage(index);
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("gallery-lightbox-open");
    $(".lightbox-close")?.focus();
  }

  function closeGalleryLightbox() {
    const lightbox = $("#galleryLightbox");
    if (!lightbox?.classList.contains("is-open")) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("gallery-lightbox-open");
    const image = $("#lightboxImage");
    if (image) image.removeAttribute("src");
    galleryLastFocus?.focus?.();
  }

  function initGallery() {
    const cards = $$(".gallery-card");
    cards.forEach((card, index) => {
      card.addEventListener("click", () => openGalleryLightbox(index));
    });
    $(".lightbox-close")?.addEventListener("click", closeGalleryLightbox);
    $(".lightbox-prev")?.addEventListener("click", () => showGalleryImage(galleryCurrentIndex - 1));
    $(".lightbox-next")?.addEventListener("click", () => showGalleryImage(galleryCurrentIndex + 1));

    const lightbox = $("#galleryLightbox");
    lightbox?.addEventListener("click", event => {
      if (event.target === lightbox) closeGalleryLightbox();
    });
  }

  /* ---------- EVENT GALLERY FILTER + LIGHTBOX ---------- */
  let eventCurrentIndex = 0;
  let eventVisibleCards = [];
  let eventLastFocus = null;

  function getVisibleEventCards() {
    return $$(".event-card").filter(card => !card.classList.contains("is-hidden"));
  }

  function showEventImage(index) {
    const lightbox = $("#eventLightbox");
    const imageTarget = $("#eventLightboxImage");
    const caption = $("#eventLightboxCaption");
    eventVisibleCards = getVisibleEventCards();
    if (!lightbox || !imageTarget || !caption || !eventVisibleCards.length) return;

    eventCurrentIndex = (index + eventVisibleCards.length) % eventVisibleCards.length;
    const card = eventVisibleCards[eventCurrentIndex];
    const image = $("img", card);
    if (!image) return;

    imageTarget.src = image.currentSrc || image.src;
    imageTarget.alt = image.alt || "";
    caption.textContent = card.dataset.title || image.alt || "";
    const disabled = eventVisibleCards.length < 2;
    const prev = $(".event-lightbox-prev");
    const next = $(".event-lightbox-next");
    if (prev) prev.disabled = disabled;
    if (next) next.disabled = disabled;
  }

  function openEventLightbox(card) {
    const lightbox = $("#eventLightbox");
    eventVisibleCards = getVisibleEventCards();
    eventCurrentIndex = eventVisibleCards.indexOf(card);
    if (!lightbox || eventCurrentIndex < 0) return;

    eventLastFocus = document.activeElement;
    showEventImage(eventCurrentIndex);
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("event-lightbox-open");
    $(".event-lightbox-close")?.focus();
  }

  function closeEventLightbox() {
    const lightbox = $("#eventLightbox");
    if (!lightbox?.classList.contains("is-open")) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("event-lightbox-open");
    $("#eventLightboxImage")?.removeAttribute("src");
    eventLastFocus?.focus?.();
  }

  function initEventGallery() {
    const cards = $$(".event-card");
    $$(".event-filter").forEach(filter => {
      filter.addEventListener("click", () => {
        const selected = filter.dataset.filter || "all";
        $$(".event-filter").forEach(button => {
          const active = button === filter;
          button.classList.toggle("active", active);
          button.setAttribute("aria-pressed", String(active));
        });
        cards.forEach(card => {
          const matches = selected === "all" || card.dataset.category === selected;
          card.classList.toggle("is-hidden", !matches);
        });
      });
    });

    cards.forEach(card => card.addEventListener("click", () => openEventLightbox(card)));
    $(".event-lightbox-close")?.addEventListener("click", closeEventLightbox);
    $(".event-lightbox-prev")?.addEventListener("click", () => showEventImage(eventCurrentIndex - 1));
    $(".event-lightbox-next")?.addEventListener("click", () => showEventImage(eventCurrentIndex + 1));

    const lightbox = $("#eventLightbox");
    lightbox?.addEventListener("click", event => {
      if (event.target === lightbox) closeEventLightbox();
    });
  }

  document.addEventListener("keydown", event => {
    if ($("#galleryLightbox")?.classList.contains("is-open")) {
      if (event.key === "ArrowRight") showGalleryImage(galleryCurrentIndex + 1);
      if (event.key === "ArrowLeft") showGalleryImage(galleryCurrentIndex - 1);
    }
    if ($("#eventLightbox")?.classList.contains("is-open")) {
      if (event.key === "ArrowRight") showEventImage(eventCurrentIndex + 1);
      if (event.key === "ArrowLeft") showEventImage(eventCurrentIndex - 1);
    }
  });

  /* ---------- DASHBOARD DEMO ---------- */
  const equipment = [
    { id: "EQ-101", name: "Cordless Drill", category: "Power Tools", price: 350, available: true, icon: "⚒", description: "Compact drill for everyday drilling and fastening." },
    { id: "EQ-102", name: "Angle Grinder", category: "Power Tools", price: 280, available: true, icon: "⚙", description: "Powerful grinder for cutting and surface finishing." },
    { id: "EQ-103", name: "Rotary Hammer", category: "Construction", price: 550, available: false, icon: "🔨", description: "Heavy-duty hammer drill for concrete work." },
    { id: "EQ-104", name: "Safety Kit", category: "Safety", price: 150, available: true, icon: "⛑", description: "Essential protective gear for your worksite." },
    { id: "EQ-105", name: "Ladder — 8 ft", category: "Lifting", price: 220, available: true, icon: "🪜", description: "Stable ladder for indoor and outdoor projects." },
    { id: "EQ-106", name: "Concrete Mixer", category: "Construction", price: 900, available: false, icon: "⚙", description: "Reliable mixer for small and medium projects." },
    { id: "EQ-107", name: "Circular Saw", category: "Power Tools", price: 400, available: true, icon: "🪚", description: "Accurate cutting for wood and sheet materials." },
    { id: "EQ-108", name: "Safety Harness", category: "Safety", price: 180, available: true, icon: "🦺", description: "Fall-protection equipment for elevated work." }
  ];

  let bookings = [
    { id: "TR-2048", equipmentId: "EQ-101", name: "Cordless Drill", pickup: "2026-10-08", returned: "2026-10-13", deposit: 2000, depositStatus: "Held", status: "On rent", updated: "Oct 8, 2026" },
    { id: "TR-2049", equipmentId: "EQ-105", name: "Ladder — 8 ft", pickup: "2026-10-15", returned: "2026-10-17", deposit: 2000, depositStatus: "Held", status: "Confirmed", updated: "Oct 10, 2026" },
    { id: "TR-2050", equipmentId: "EQ-104", name: "Safety Kit", pickup: "2026-10-06", returned: "2026-10-09", deposit: 2000, depositStatus: "Processing", status: "Return due", updated: "Oct 9, 2026" }
  ];

  let selectedEquipmentId = null;
  let selectedBookingId = null;
  let toastTimer = null;

  const money = value => new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0
  }).format(value);

  const dateFormat = value => {
    if (!value) return "—";
    const date = new Date(`${value}T00:00:00`);
    return Number.isNaN(date.getTime()) ? value :
      date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  const shortDate = value => {
    if (!value) return "—";
    const date = new Date(`${value}T00:00:00`);
    return Number.isNaN(date.getTime()) ? value :
      date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  const statusClass = status => String(status).toLowerCase().replace(/\s+/g, "-");
  const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);

  function showToast(message) {
    const toast = $("#toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
  }

  function navigate(viewName) {
    const validViews = ["overview", "equipment", "bookings", "deposits", "support"];
    const target = validViews.includes(viewName) ? viewName : "overview";
    $$(".view").forEach(view => view.classList.toggle("active", view.id === `view-${target}`));
    $$(".nav-item[data-view]").forEach(button => button.classList.toggle("active", button.dataset.view === target));

    const titles = {
      overview: "Overview", equipment: "Equipment availability",
      bookings: "My bookings", deposits: "Security deposits", support: "Help & support"
    };
    const pageTitle = $("#currentPage");
    if (pageTitle) pageTitle.textContent = titles[target];

    $("#sidebar")?.classList.remove("open");
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (target === "equipment") renderEquipment();
    if (target === "bookings") renderBookings();
    if (target === "deposits") renderDeposits();
  }

  function renderEquipmentCard(item) {
    return `
      <article class="equipment-card">
        <div class="equipment-image">
          <span aria-hidden="true">${item.icon}</span>
          <span class="equipment-category">${escapeHTML(item.category)}</span>
        </div>
        <div class="equipment-card-body">
          <h3>${escapeHTML(item.name)}</h3>
          <p class="equipment-description">${escapeHTML(item.description)}</p>
          <div class="equipment-meta">
            <span class="equipment-price">${money(item.price)}<small> / day</small></span>
            <span class="availability-label ${item.available ? "" : "unavailable"}">${item.available ? "● Available" : "● Unavailable"}</span>
          </div>
          <button class="btn ${item.available ? "btn-primary" : "btn-light"}" data-rent="${item.id}" ${item.available ? "" : "disabled"}>
            ${item.available ? "Request rental →" : "Currently unavailable"}
          </button>
        </div>
      </article>`;
  }

  function renderEquipment() {
    const search = ($("#equipmentSearch")?.value || "").trim().toLowerCase();
    const category = $("#categoryFilter")?.value || "all";
    const availability = $("#availabilityFilter")?.value || "all";

    const filtered = equipment.filter(item => {
      const matchesSearch = `${item.name} ${item.category} ${item.description}`.toLowerCase().includes(search);
      const matchesCategory = category === "all" || item.category === category;
      const matchesAvailability = availability === "all" ||
        (availability === "available" ? item.available : !item.available);
      return matchesSearch && matchesCategory && matchesAvailability;
    });

    const target = $("#allEquipment");
    if (target) target.innerHTML = filtered.map(renderEquipmentCard).join("");
    $("#equipmentEmpty")?.classList.toggle("hidden", filtered.length !== 0);
  }

  function renderFeaturedEquipment() {
    const target = $("#featuredEquipment");
    if (target) target.innerHTML = equipment.filter(item => item.available).slice(0, 3).map(renderEquipmentCard).join("");
  }

  function renderRecentBookings() {
    const target = $("#recentBookingsBody");
    if (!target) return;
    target.innerHTML = bookings.slice(0, 4).map(booking => `
      <tr>
        <td><strong>${escapeHTML(booking.name)}</strong><br><span class="muted">${escapeHTML(booking.id)}</span></td>
        <td>${shortDate(booking.pickup)} – ${shortDate(booking.returned)}</td>
        <td><span class="status ${statusClass(booking.status)}">${escapeHTML(booking.status)}</span></td>
        <td><button class="row-action" data-booking-details="${booking.id}" aria-label="View ${escapeHTML(booking.id)} details">→</button></td>
      </tr>`).join("");
  }

  function renderTimeline() {
    const target = $("#upcomingTimeline");
    if (!target) return;
    const upcoming = [...bookings]
      .filter(booking => !["Completed", "Cancelled"].includes(booking.status))
      .sort((a, b) => a.pickup.localeCompare(b.pickup))
      .slice(0, 3);

    target.innerHTML = upcoming.length ? upcoming.map(booking => `
      <div class="timeline-item">
        <div class="timeline-icon">${booking.status === "Return due" ? "↩" : "▣"}</div>
        <div>
          <strong>${booking.status === "Return due" ? "Return equipment" : booking.status === "On rent" ? "Equipment on rent" : "Pickup scheduled"}</strong>
          <p>${escapeHTML(booking.name)}</p>
          <small>${shortDate(booking.status === "Return due" ? booking.returned : booking.pickup)} · ${escapeHTML(booking.id)}</small>
        </div>
      </div>`).join("") : '<p class="muted">No upcoming rental activity.</p>';
  }

  function renderBookings() {
    const search = ($("#bookingSearch")?.value || "").trim().toLowerCase();
    const status = $("#bookingStatusFilter")?.value || "all";
    const filtered = bookings.filter(booking =>
      `${booking.id} ${booking.name}`.toLowerCase().includes(search) &&
      (status === "all" || booking.status === status)
    );

    const target = $("#allBookingsBody");
    if (target) target.innerHTML = filtered.map(booking => `
      <tr>
        <td><strong>${escapeHTML(booking.id)}</strong><br><span class="muted">${escapeHTML(booking.name)}</span></td>
        <td>${dateFormat(booking.pickup)}</td>
        <td>${dateFormat(booking.returned)}</td>
        <td>${money(booking.deposit)}</td>
        <td><span class="status ${statusClass(booking.status)}">${escapeHTML(booking.status)}</span></td>
        <td><button class="text-button" data-booking-details="${booking.id}">View details</button></td>
      </tr>`).join("");

    $("#bookingsEmpty")?.classList.toggle("hidden", filtered.length !== 0);
    const count = $("#bookingNavCount");
    if (count) count.textContent = String(bookings.length);
    updateStats();
  }

  function renderDeposits() {
    const target = $("#depositHistoryBody");
    if (target) target.innerHTML = bookings.map(booking => `
      <tr>
        <td><strong>${escapeHTML(booking.id)}</strong></td>
        <td>${escapeHTML(booking.name)}</td>
        <td>${money(booking.deposit)}</td>
        <td><span class="deposit-status ${statusClass(booking.depositStatus)}">${escapeHTML(booking.depositStatus)}</span></td>
        <td>${escapeHTML(booking.updated)}</td>
      </tr>`).join("");

    const total = bookings.reduce((sum, booking) => sum + booking.deposit, 0);
    const held = bookings.filter(booking => booking.depositStatus === "Held").reduce((sum, booking) => sum + booking.deposit, 0);
    const processing = bookings.filter(booking => booking.depositStatus === "Processing").reduce((sum, booking) => sum + booking.deposit, 0);
    if ($("#depositSummaryTotal")) $("#depositSummaryTotal").textContent = money(total);
    if ($("#depositTotal")) $("#depositTotal").textContent = money(total);
    if ($("#depositHeld")) $("#depositHeld").textContent = money(held);
    if ($("#depositProcessing")) $("#depositProcessing").textContent = money(processing);
  }

  function updateStats() {
    const active = bookings.filter(booking => ["On rent", "Return due"].includes(booking.status)).length;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcoming = bookings.filter(booking => {
      const pickup = new Date(`${booking.pickup}T00:00:00`);
      return booking.status === "Confirmed" && pickup >= today;
    }).length;
    const due = bookings.filter(booking => booking.status === "Return due").length;

    if ($("#activeBookingsCount")) $("#activeBookingsCount").textContent = String(active);
    if ($("#upcomingPickupsCount")) $("#upcomingPickupsCount").textContent = String(upcoming);
    if ($("#returnsDueCount")) $("#returnsDueCount").textContent = String(due);
  }

  function openBookingDetails(id) {
    const booking = bookings.find(item => item.id === id);
    if (!booking) return;
    selectedBookingId = id;

    const title = $("#modalTitle");
    const body = $("#modalBody");
    if (title) title.textContent = booking.name;
    if (body) body.innerHTML = `
      <div class="detail-grid">
        <div class="detail-item"><small>Booking reference</small><strong>${escapeHTML(booking.id)}</strong></div>
        <div class="detail-item"><small>Booking status</small><strong><span class="status ${statusClass(booking.status)}">${escapeHTML(booking.status)}</span></strong></div>
        <div class="detail-item"><small>Pickup date</small><strong>${dateFormat(booking.pickup)}</strong></div>
        <div class="detail-item"><small>Expected return</small><strong>${dateFormat(booking.returned)}</strong></div>
        <div class="detail-item"><small>Security deposit</small><strong>${money(booking.deposit)}</strong></div>
        <div class="detail-item"><small>Deposit status</small><strong>${escapeHTML(booking.depositStatus)}</strong></div>
      </div>
      <p class="form-help">Frontend demo: this booking is sample data and is not connected to a rental service.</p>`;

    const action = $("#modalAction");
    if (action) {
      action.textContent = ["On rent", "Return due"].includes(booking.status)
        ? "Mark as returned (demo)" : "Close details";
      action.disabled = false;
    }
    $("#bookingModal")?.showModal();
  }

  function openRequestModal(equipmentId) {
    const item = equipment.find(entry => entry.id === equipmentId);
    if (!item || !item.available) {
      showToast("This equipment is currently unavailable.");
      return;
    }

    selectedEquipmentId = equipmentId;
    if ($("#requestTitle")) $("#requestTitle").textContent = "Request equipment";
    if ($("#requestEquipmentName")) $("#requestEquipmentName").textContent = `${item.name} · ${money(item.price)} per day`;
    if ($("#pickupDate")) $("#pickupDate").value = "";
    if ($("#returnDate")) $("#returnDate").value = "";
    if ($("#requestNotes")) $("#requestNotes").value = "";

    const today = new Date();
    const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    if ($("#pickupDate")) $("#pickupDate").min = todayString;
    if ($("#returnDate")) $("#returnDate").min = todayString;
    $("#bookingRequestModal")?.showModal();
  }

  function closeDialog(dialog) {
    if (dialog?.open) dialog.close();
  }

  function submitRequest(event) {
    event.preventDefault();
    const item = equipment.find(entry => entry.id === selectedEquipmentId);
    const pickup = $("#pickupDate")?.value;
    const returned = $("#returnDate")?.value;

    if (!item) return showToast("Please select equipment first.");
    if (!pickup || !returned || pickup < $("#pickupDate").min || returned <= pickup) {
      return showToast("Choose a valid pickup date and a return date after pickup.");
    }

    const numericIds = bookings.map(booking => Number(booking.id.replace("TR-", ""))).filter(Number.isFinite);
    const newId = `TR-${Math.max(2050, ...numericIds) + 1}`;
    bookings.unshift({
      id: newId, equipmentId: item.id, name: item.name, pickup, returned,
      deposit: 2000, depositStatus: "Held", status: "Confirmed",
      updated: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    });

    closeDialog($("#bookingRequestModal"));
    renderAll();
    showToast(`Demo request ${newId} added to My bookings.`);
    navigate("bookings");
  }

  function renderAll() {
    renderFeaturedEquipment();
    renderEquipment();
    renderRecentBookings();
    renderTimeline();
    renderBookings();
    renderDeposits();
    updateStats();
  }

  function initDashboard() {
    // Navigation
    $$(".nav-item[data-view]").forEach(button => button.addEventListener("click", () => navigate(button.dataset.view)));
    $$("[data-go]").forEach(button => button.addEventListener("click", () => navigate(button.dataset.go)));

    // Equipment / booking actions
    document.addEventListener("click", event => {
      const rentButton = event.target.closest("[data-rent]");
      if (rentButton) return openRequestModal(rentButton.dataset.rent);
      const detailsButton = event.target.closest("[data-booking-details]");
      if (detailsButton) openBookingDetails(detailsButton.dataset.bookingDetails);
    });

    $("#equipmentSearch")?.addEventListener("input", renderEquipment);
    $("#categoryFilter")?.addEventListener("change", renderEquipment);
    $("#availabilityFilter")?.addEventListener("change", renderEquipment);
    $("#bookingSearch")?.addEventListener("input", renderBookings);
    $("#bookingStatusFilter")?.addEventListener("change", renderBookings);
    $("#menuToggle")?.addEventListener("click", () => $("#sidebar")?.classList.toggle("open"));

    // IMPORTANT: Do not add another listener to #themeToggle here.
    // The global theme listener above handles all pages consistently.
    $("#notificationBtn")?.addEventListener("click", () => showToast("You're all caught up!"));

    $("#closeModal")?.addEventListener("click", () => closeDialog($("#bookingModal")));
    $("#modalCloseBottom")?.addEventListener("click", () => closeDialog($("#bookingModal")));
    $("#closeRequestModal")?.addEventListener("click", () => closeDialog($("#bookingRequestModal")));
    $("#cancelRequest")?.addEventListener("click", () => closeDialog($("#bookingRequestModal")));
    $("#bookingRequestForm")?.addEventListener("submit", submitRequest);

    $("#pickupDate")?.addEventListener("change", () => {
      const pickup = $("#pickupDate").value;
      if (pickup) $("#returnDate").min = pickup;
      if ($("#returnDate").value && $("#returnDate").value <= pickup) $("#returnDate").value = "";
    });

    $("#modalAction")?.addEventListener("click", () => {
      const booking = bookings.find(item => item.id === selectedBookingId);
      if (!booking) return closeDialog($("#bookingModal"));
      if (["On rent", "Return due"].includes(booking.status)) {
        booking.status = "Completed";
        booking.depositStatus = "Processing";
        booking.updated = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
        closeDialog($("#bookingModal"));
        renderAll();
        showToast(`${booking.name} marked as returned in this demo.`);
      } else {
        closeDialog($("#bookingModal"));
      }
    });

    ["bookingModal", "bookingRequestModal"].forEach(id => {
      const dialog = $(`#${id}`);
      dialog?.addEventListener("click", event => {
        if (event.target === dialog) closeDialog(dialog);
      });
    });

    renderAll();

    const dateLabel = $(".welcome-row .eyebrow");
    if (dateLabel) {
      dateLabel.textContent = new Date().toLocaleDateString("en-US", {
        weekday: "long", month: "long", day: "numeric", year: "numeric"
      }).toUpperCase();
    }
  }

  /* ---------- INITIALIZE AFTER DOM IS READY ---------- */
  function init() {
    setActiveNavigation();
    initFAQs();
    initGallery();
    initEventGallery();
    initDashboard();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
