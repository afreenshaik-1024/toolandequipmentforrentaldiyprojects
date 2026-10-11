
/* ========================================
   TOOLRENT - COMPLETE JAVASCRIPT
======================================== */

// HTML Elements
const homeDropdown = document.getElementById("homeDropdown");
const dropdownMenu = document.getElementById("homeDropdownMenu");
const navMenu = document.getElementById("navMenu");
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const rtlToggle = document.getElementById("rtlToggle");


// ========================================
// 1. HOME DROPDOWN
// ========================================

if (homeDropdown && dropdownMenu) {
    homeDropdown.addEventListener("click", (event) => {
        event.stopPropagation();

        const isOpen = dropdownMenu.classList.toggle("show");

        homeDropdown.setAttribute("aria-expanded", String(isOpen));
    });
}


// ========================================
// 2. MOBILE NAVIGATION
// ========================================

if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener("click", () => {
        const isOpen = navMenu.classList.toggle("open");

        mobileMenuBtn.setAttribute("aria-expanded", String(isOpen));

        mobileMenuBtn.innerHTML = isOpen
            ? '<i class="fa-solid fa-xmark"></i>'
            : '<i class="fa-solid fa-bars"></i>';
    });

    // Close menu after clicking a navigation link
    navMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("open");

            mobileMenuBtn.setAttribute("aria-expanded", "false");

            mobileMenuBtn.innerHTML =
                '<i class="fa-solid fa-bars"></i>';
        });
    });
}


// ========================================
// 3. DARK MODE / LIGHT MODE
// ========================================

function applyTheme(theme) {
    const selectedTheme = theme === "dark" ? "dark" : "light";

    // Apply theme to the entire document
    document.documentElement.setAttribute(
        "data-theme",
        selectedTheme
    );

    // Apply classes for CSS compatibility
    document.body.classList.toggle(
        "dark-mode",
        selectedTheme === "dark"
    );

    document.body.classList.toggle(
        "light-mode",
        selectedTheme === "light"
    );

    // Update theme icon
    if (themeIcon) {
        themeIcon.className =
            selectedTheme === "dark"
                ? "fa-solid fa-sun"
                : "fa-solid fa-moon";
    }

    // Update accessibility label
    if (themeToggle) {
        themeToggle.setAttribute(
            "aria-label",
            selectedTheme === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode"
        );

        themeToggle.setAttribute("aria-pressed",
            String(selectedTheme === "dark")
        );
    }

    // Save theme preference
    try {
        localStorage.setItem("theme", selectedTheme);
    } catch (error) {
        console.warn("Theme preference could not be saved.");
    }
}


// Load saved theme
let initialTheme = "light";

try {
    initialTheme = localStorage.getItem("theme") || "light";
} catch (error) {
    console.warn("Saved theme could not be accessed.");
}

applyTheme(initialTheme);


// Toggle theme on button click
if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const currentTheme =
            document.documentElement.getAttribute("data-theme") || "light";

        const newTheme =
            currentTheme === "dark" ? "light" : "dark";

        applyTheme(newTheme);
    });
}


// ========================================
// 4. RTL / LTR DIRECTION
// ========================================

if (rtlToggle) {
    rtlToggle.addEventListener("click", () => {
        const currentDirection =
            document.documentElement.getAttribute("dir") || "ltr";

        const newDirection =
            currentDirection === "rtl" ? "ltr" : "rtl";

        document.documentElement.setAttribute("dir", newDirection);
    });
}


// ========================================
// 5. CLOSE DROPDOWN ON OUTSIDE CLICK
// ========================================

document.addEventListener("click", (event) => {
    if (
        dropdownMenu &&
        !event.target.closest(".dropdown")
    ) {
        dropdownMenu.classList.remove("show");

        if (homeDropdown) {
            homeDropdown.setAttribute("aria-expanded", "false");
        }
    }
});


// ========================================
// 6. CLOSE DROPDOWN WITH ESCAPE KEY
// ========================================

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        if (dropdownMenu) {
            dropdownMenu.classList.remove("show");
        }

        if (homeDropdown) {
            homeDropdown.setAttribute("aria-expanded", "false");
        }

        if (navMenu && mobileMenuBtn) {
            navMenu.classList.remove("open");

            mobileMenuBtn.setAttribute("aria-expanded", "false");

            mobileMenuBtn.innerHTML =
                '<i class="fa-solid fa-bars"></i>';
        }
    }
});
/* ================= FAQ ACCORDION ================= */

document.addEventListener("DOMContentLoaded", () => {
    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach((item) => {
        const question = item.querySelector(".faq-question");

        question.addEventListener("click", () => {
            const isOpen = item.classList.contains("active");

            // Close all FAQ items
            faqItems.forEach((faq) => {
                faq.classList.remove("active");

                const button = faq.querySelector(".faq-question");
                button.setAttribute("aria-expanded", "false");
            });

            // Open the clicked item if it was closed
            if (!isOpen) {
                item.classList.add("active");
                question.setAttribute("aria-expanded", "true");
            }
        });
    });
});


/* ===== Product Gallery Lightbox ===== */

(() => {
  const cards = [...document.querySelectorAll(".gallery-card")];
  const lightbox = document.getElementById("galleryLightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const closeButton = document.querySelector(".lightbox-close");
  const prevButton = document.querySelector(".lightbox-prev");
  const nextButton = document.querySelector(".lightbox-next");

  if (
    !cards.length ||
    !lightbox ||
    !lightboxImage ||
    !lightboxCaption
  ) return;

  let currentIndex = 0;
  let lastFocusedElement = null;

  function showImage(index) {
    currentIndex = (index + cards.length) % cards.length;

    const card = cards[currentIndex];
    const image = card.querySelector("img");

    lightboxImage.src = card.dataset.image || image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent =
      card.dataset.title || image.alt;

    prevButton.disabled = cards.length < 2;
    nextButton.disabled = cards.length < 2;
  }

  function openLightbox(index) {
    lastFocusedElement = document.activeElement;
    showImage(index);

    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("gallery-lightbox-open");

    closeButton.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("gallery-lightbox-open");

    lightboxImage.src = "";

    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  cards.forEach((card, index) => {
    card.addEventListener("click", () => {
      openLightbox(index);
    });
  });

  closeButton.addEventListener("click", closeLightbox);

  prevButton.addEventListener("click", () => {
    showImage(currentIndex - 1);
  });

  nextButton.addEventListener("click", () => {
    showImage(currentIndex + 1);
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("is-open")) return;

    if (event.key === "Escape") {
      closeLightbox();
    } else if (event.key === "ArrowRight") {
      showImage(currentIndex + 1);
    } else if (event.key === "ArrowLeft") {
      showImage(currentIndex - 1);
    }
  });
})();

(() => {
  const cards = [...document.querySelectorAll(".event-card")];
  const filters = [...document.querySelectorAll(".event-filter")];

  const lightbox = document.getElementById("eventLightbox");
  const lightboxImage = document.getElementById("eventLightboxImage");
  const lightboxCaption = document.getElementById("eventLightboxCaption");

  const closeButton = document.querySelector(".event-lightbox-close");
  const prevButton = document.querySelector(".event-lightbox-prev");
  const nextButton = document.querySelector(".event-lightbox-next");

  if (!cards.length) return;

  /* ===== CATEGORY FILTERS ===== */

  filters.forEach((filter) => {
    filter.addEventListener("click", () => {
      const selectedCategory = filter.dataset.filter;

      filters.forEach((button) => {
        const isActive = button === filter;
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
      });

      cards.forEach((card) => {
        const matches =
          selectedCategory === "all" ||
          card.dataset.category === selectedCategory;

        card.classList.toggle("is-hidden", !matches);
      });
    });
  });

  /* ===== LIGHTBOX ===== */

  if (
    !lightbox ||
    !lightboxImage ||
    !lightboxCaption ||
    !closeButton ||
    !prevButton ||
    !nextButton
  ) {
    return;
  }

  let visibleCards = [...cards];
  let currentIndex = 0;
  let lastFocusedElement = null;

  function getVisibleCards() {
    return cards.filter((card) => !card.classList.contains("is-hidden"));
  }

  function showImage(index) {
    visibleCards = getVisibleCards();

    if (!visibleCards.length) return;

    currentIndex =
      (index + visibleCards.length) % visibleCards.length;

    const card = visibleCards[currentIndex];
    const image = card.querySelector("img");

    if (!image) return;

    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt || "";
    lightboxCaption.textContent =
      card.dataset.title || image.alt || "";

    const disableNavigation = visibleCards.length < 2;
    prevButton.disabled = disableNavigation;
    nextButton.disabled = disableNavigation;
  }

  function openLightbox(card) {
    visibleCards = getVisibleCards();
    currentIndex = visibleCards.indexOf(card);

    if (currentIndex < 0) return;

    lastFocusedElement = document.activeElement;

    showImage(currentIndex);

    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("event-lightbox-open");

    closeButton.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("event-lightbox-open");

    lightboxImage.removeAttribute("src");

    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      openLightbox(card);
    });
  });

  closeButton.addEventListener("click", closeLightbox);

  prevButton.addEventListener("click", () => {
    showImage(currentIndex - 1);
  });

  nextButton.addEventListener("click", () => {
    showImage(currentIndex + 1);
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("is-open")) return;

    if (event.key === "Escape") {
      closeLightbox();
    }

    if (event.key === "ArrowLeft") {
      showImage(currentIndex - 1);
    }

    if (event.key === "ArrowRight") {
      showImage(currentIndex + 1);
    }
  });
})();

/* ToolNest / ToolRent Renter Dashboard
   Frontend demo only — no backend, database, or real payment processing.
   Save as script.js beside index.html and dashboard.css.
*/
(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const equipment = [
    { id: "EQ-101", name: "Cordless Drill", category: "Power Tools", price: 350, available: true, icon: "⚒", description: "Compact drill for everyday drilling and fastening.", image: "" },
    { id: "EQ-102", name: "Angle Grinder", category: "Power Tools", price: 280, available: true, icon: "⚙", description: "Powerful grinder for cutting and surface finishing.", image: "" },
    { id: "EQ-103", name: "Rotary Hammer", category: "Construction", price: 550, available: false, icon: "🔨", description: "Heavy-duty hammer drill for concrete work.", image: "" },
    { id: "EQ-104", name: "Safety Kit", category: "Safety", price: 150, available: true, icon: "⛑", description: "Essential protective gear for your worksite.", image: "" },
    { id: "EQ-105", name: "Ladder — 8 ft", category: "Lifting", price: 220, available: true, icon: "🪜", description: "Stable ladder for indoor and outdoor projects.", image: "" },
    { id: "EQ-106", name: "Concrete Mixer", category: "Construction", price: 900, available: false, icon: "⚙", description: "Reliable mixer for small and medium projects.", image: "" },
    { id: "EQ-107", name: "Circular Saw", category: "Power Tools", price: 400, available: true, icon: "🪚", description: "Accurate cutting for wood and sheet materials.", image: "" },
    { id: "EQ-108", name: "Safety Harness", category: "Safety", price: 180, available: true, icon: "🦺", description: "Fall-protection equipment for elevated work.", image: "" }
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
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  const shortDate = value => {
    if (!value) return "—";
    const date = new Date(`${value}T00:00:00`);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  const statusClass = status => status.toLowerCase().replace(/\s+/g, "-");
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

    const title = {
      overview: "Overview",
      equipment: "Equipment availability",
      bookings: "My bookings",
      deposits: "Security deposits",
      support: "Help & support"
    };
    const currentPage = $("#currentPage");
    if (currentPage) currentPage.textContent = title[target];

    $("#sidebar")?.classList.remove("open");
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (target === "equipment") renderEquipment();
    if (target === "bookings") renderBookings();
    if (target === "deposits") renderDeposits();
  }

  function renderEquipmentCard(item) {
    const imageContent = item.image
      ? `<img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.name)}">`
      : `<span aria-hidden="true">${item.icon}</span>`;
    return `
      <article class="equipment-card">
        <div class="equipment-image">
          ${imageContent}
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

    const allEquipment = $("#allEquipment");
    if (allEquipment) allEquipment.innerHTML = filtered.map(renderEquipmentCard).join("");

    const empty = $("#equipmentEmpty");
    if (empty) empty.classList.toggle("hidden", filtered.length !== 0);
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
        <td><strong>${escapeHTML(booking.name)}</strong><br><span style="color:var(--muted)">${escapeHTML(booking.id)}</span></td>
        <td>${shortDate(booking.pickup)} – ${shortDate(booking.returned)}</td>
        <td><span class="status ${statusClass(booking.status)}">${escapeHTML(booking.status)}</span></td>
        <td><button class="row-action" data-booking-details="${booking.id}" aria-label="View ${escapeHTML(booking.id)} details">→</button></td>
      </tr>`).join("");
  }

  function renderTimeline() {
    const target = $("#upcomingTimeline");
    if (!target) return;
    const upcoming = [...bookings]
      .filter(booking => booking.status !== "Completed" && booking.status !== "Cancelled")
      .sort((a, b) => a.pickup.localeCompare(b.pickup))
      .slice(0, 3);

    target.innerHTML = upcoming.length ? upcoming.map(booking => `
      <div class="timeline-item">
        <div class="timeline-icon">${booking.status === "Return due" ? "↩" : "▣"}</div>
        <div>
          <strong>${escapeHTML(booking.status === "Return due" ? "Return equipment" : booking.status === "On rent" ? "Equipment on rent" : "Pickup scheduled")}</strong>
          <p>${escapeHTML(booking.name)}</p>
          <small>${booking.status === "Return due" ? shortDate(booking.returned) : shortDate(booking.pickup)} · ${escapeHTML(booking.id)}</small>
        </div>
      </div>`).join("") : `<p class="muted">No upcoming rental activity.</p>`;
  }

  function renderBookings() {
    const search = ($("#bookingSearch")?.value || "").trim().toLowerCase();
    const status = $("#bookingStatusFilter")?.value || "all";
    const filtered = bookings.filter(booking => {
      const matchesSearch = `${booking.id} ${booking.name}`.toLowerCase().includes(search);
      return matchesSearch && (status === "all" || booking.status === status);
    });

    const target = $("#allBookingsBody");
    if (target) target.innerHTML = filtered.map(booking => `
      <tr>
        <td><strong>${escapeHTML(booking.id)}</strong><br><span style="color:var(--muted)">${escapeHTML(booking.name)}</span></td>
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
    const active = bookings.filter(booking => booking.status === "On rent" || booking.status === "Return due").length;
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

    $("#modalTitle").textContent = booking.name;
    $("#modalBody").innerHTML = `
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
      action.textContent = booking.status === "On rent" || booking.status === "Return due"
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
    $("#requestTitle").textContent = "Request equipment";
    $("#requestEquipmentName").textContent = `${item.name} · ${money(item.price)} per day`;
    $("#pickupDate").value = "";
    $("#returnDate").value = "";
    $("#requestNotes").value = "";

    const today = new Date();
    const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    $("#pickupDate").min = todayString;
    $("#returnDate").min = todayString;
    $("#bookingRequestModal")?.showModal();
  }

  function closeDialog(dialog) {
    if (dialog?.open) dialog.close();
  }

  function submitRequest(event) {
    event.preventDefault();
    const item = equipment.find(entry => entry.id === selectedEquipmentId);
    const pickup = $("#pickupDate").value;
    const returned = $("#returnDate").value;

    if (!item) {
      showToast("Please select equipment first.");
      return;
    }
    if (pickup < $("#pickupDate").min || returned <= pickup) {
      showToast("Choose a valid pickup date and a return date after pickup.");
      return;
    }

    const newId = `TR-${2051 + bookings.length - 3}`;
    bookings.unshift({
      id: newId,
      equipmentId: item.id,
      name: item.name,
      pickup,
      returned,
      deposit: 2000,
      depositStatus: "Held",
      status: "Confirmed",
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

  function attachEvents() {
    $$(".nav-item[data-view]").forEach(button => {
      button.addEventListener("click", () => navigate(button.dataset.view));
    });

    $$("[data-go]").forEach(button => {
      button.addEventListener("click", () => navigate(button.dataset.go));
    });

    document.addEventListener("click", event => {
      const rentButton = event.target.closest("[data-rent]");
      if (rentButton) {
        openRequestModal(rentButton.dataset.rent);
        return;
      }
      const detailsButton = event.target.closest("[data-booking-details]");
      if (detailsButton) openBookingDetails(detailsButton.dataset.bookingDetails);
    });

    $("#equipmentSearch")?.addEventListener("input", renderEquipment);
    $("#categoryFilter")?.addEventListener("change", renderEquipment);
    $("#availabilityFilter")?.addEventListener("change", renderEquipment);
    $("#bookingSearch")?.addEventListener("input", renderBookings);
    $("#bookingStatusFilter")?.addEventListener("change", renderBookings);

    $("#menuToggle")?.addEventListener("click", () => $("#sidebar")?.classList.toggle("open"));
    $("#themeToggle")?.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      const enabled = document.body.classList.contains("dark-mode");
      $("#themeToggle").textContent = enabled ? "☀" : "◐";
      showToast(enabled ? "Dark mode enabled." : "Light mode enabled.");
    });

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
      if (!booking) {
        closeDialog($("#bookingModal"));
        return;
      }
      if (booking.status === "On rent" || booking.status === "Return due") {
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

    // Clicking the dimmed dialog background closes the modal.
    ["bookingModal", "bookingRequestModal"].forEach(id => {
      const dialog = $(`#${id}`);
      dialog?.addEventListener("click", event => {
        if (event.target === dialog) closeDialog(dialog);
      });
    });
  }

  function init() {
    attachEvents();
    renderAll();
    const dateLabel = $(".welcome-row .eyebrow");
    if (dateLabel) {
      const today = new Date();
      dateLabel.textContent = today.toLocaleDateString("en-US", {
        weekday: "long", month: "long", day: "numeric", year: "numeric"
      }).toUpperCase();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
