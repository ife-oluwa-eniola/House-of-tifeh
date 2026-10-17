(() => {
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const loader = $(".loader");
  const finishLoading = () => loader?.classList.add("is-done");
  window.addEventListener("load", () => window.setTimeout(finishLoading, 450), { once: true });
  window.setTimeout(finishLoading, 1800);

  $("#year").textContent = new Date().getFullYear();

  const menuButton = $(".menu-toggle");
  const nav = $("#main-nav");
  function closeMenu() {
    menuButton?.setAttribute("aria-expanded", "false");
    menuButton?.setAttribute("aria-label", "Open navigation");
    nav?.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  }
  menuButton?.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    nav?.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
  });
  $$("#main-nav a").forEach(link => link.addEventListener("click", closeMenu));
  window.addEventListener("resize", () => { if (window.innerWidth > 680) closeMenu(); });

  const revealItems = $$(".reveal");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("is-visible"));
  }

  const filterButtons = $$(".filter-button");
  const galleryItems = $$(".gallery-item");
  filterButtons.forEach(button => button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach(item => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    galleryItems.forEach(item => {
      item.hidden = filter !== "all" && item.dataset.category !== filter;
    });
  }));

  const lightbox = $("#lightbox");
  const lightboxImage = $("#lightbox-image");
  const lightboxCaption = $("#lightbox-caption");
  galleryItems.forEach(item => item.addEventListener("click", () => {
    const image = $("img", item);
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = item.dataset.caption || "House of Tifeh inspiration";
    if (typeof lightbox.showModal === "function") lightbox.showModal();
    else lightbox.setAttribute("open", "");
  }));
  $(".lightbox-close")?.addEventListener("click", () => lightbox.close());
  lightbox?.addEventListener("click", event => {
    if (event.target === lightbox) lightbox.close();
  });
  lightbox?.addEventListener("close", () => { lightboxImage.src = ""; });

  const form = $("#booking-form");
  const steps = $$(".form-step", form);
  const progressFill = $("#progress-fill");
  const stepLabel = $("#step-label");
  const stepTitle = $("#step-title");
  const alertBox = $("#form-alert");
  const stepTitles = { 1: "Your service", 2: "Date & location", 3: "Your details", 4: "Review booking" };
  let currentStep = 1;
  const dateInput = $("#event-date");
  const today = new Date();
  const localToday = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, "0"), String(today.getDate()).padStart(2, "0")].join("-");
  dateInput.min = localToday;

  function showStep(step) {
    currentStep = step;
    steps.forEach(panel => panel.classList.toggle("is-current", Number(panel.dataset.step) === step));
    stepLabel.textContent = "STEP " + String(Math.min(step, 3)).padStart(2, "0") + " OF 03";
    stepTitle.textContent = stepTitles[step];
    progressFill.style.width = (step === 4 ? 100 : step / 3 * 100) + "%";
    alertBox.textContent = "";
    $("#booking .booking-panel").scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  }
  function validateStep(step) {
    alertBox.textContent = "";
    const panel = steps.find(item => Number(item.dataset.step) === step);
    const fields = $$("input:not([type=radio]), select, textarea", panel).filter(field => field.required && !field.disabled && field.offsetParent !== null);
    let firstInvalid = null;
    fields.forEach(field => {
      field.setAttribute("aria-invalid", String(!field.checkValidity()));
      if (!field.checkValidity() && !firstInvalid) firstInvalid = field;
    });
    if (step === 2) {
      const locationChosen = $('input[name="locationType"]:checked', panel);
      if (!locationChosen && !firstInvalid) firstInvalid = $('input[name="locationType"]', panel);
      if (dateInput.value && dateInput.value < localToday && !firstInvalid) firstInvalid = dateInput;
      const home = locationChosen?.value === "Home service";
      const homeFields = [$("#house-address"), $("#area"), $("#city")];
      homeFields.forEach(field => {
        if (field) field.required = Boolean(home);
        if (home && field && !field.value.trim() && !firstInvalid) firstInvalid = field;
        field?.setAttribute("aria-invalid", String(Boolean(home && !field.value.trim())));
      });
    }
    if (firstInvalid) {
      alertBox.textContent = step === 2 && !dateInput.value ? "Please choose a preferred date and time before continuing." : "Please complete the required fields before continuing.";
      firstInvalid.focus();
      return false;
    }
    return true;
  }
  $$("[data-next]", form).forEach(button => button.addEventListener("click", () => {
    if (validateStep(currentStep)) showStep(Math.min(currentStep + 1, 3));
  }));
  $$("[data-back]", form).forEach(button => button.addEventListener("click", () => showStep(Math.max(currentStep - 1, 1))));
  form.addEventListener("input", event => {
    if (event.target.matches("input,select,textarea")) event.target.removeAttribute("aria-invalid");
    alertBox.textContent = "";
  });
  $$('input[name="locationType"]', form).forEach(radio => radio.addEventListener("change", () => {
    const home = radio.value === "Home service" && radio.checked;
    $("#home-address-fields").hidden = !home;
    [$("#house-address"), $("#area"), $("#city")].forEach(field => {
      field.required = home;
      if (!home) field.removeAttribute("aria-invalid");
    });
  }));
  $$(".card-link[data-service]").forEach(link => link.addEventListener("click", () => {
    const service = $("#service");
    const option = [...service.options].find(item => item.textContent.trim() === link.dataset.service);
    if (option) service.value = option.value;
  }));

  function readBooking() {
    const data = new FormData(form);
    const locationType = data.get("locationType") || "Not selected";
    const address = locationType === "Home service"
      ? [data.get("address"), data.get("area"), data.get("city")].filter(Boolean).join(", ")
      : "Studio (exact address to be shared by the artist)";
    return {
      service: data.get("service") || "",
      eventType: data.get("eventType") || "",
      date: data.get("date") || "",
      time: data.get("time") || "",
      locationType,
      address,
      name: data.get("name") || "",
      phone: data.get("phone") || "",
      email: data.get("email") || "",
      notes: data.get("notes") || ""
    };
  }
  function prettyDate(value) {
    if (!value) return "Not selected";
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" });
  }
  function prettyTime(value) {
    if (!value) return "Not selected";
    const [hours, minutes] = value.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date.toLocaleTimeString("en-NG", { hour: "numeric", minute: "2-digit" });
  }
  function makeReview() {
    const booking = readBooking();
    const rows = [
      ["Service", booking.service],
      ["Occasion", booking.eventType],
      ["Preferred date", prettyDate(booking.date)],
      ["Preferred time", prettyTime(booking.time)],
      ["Location type", booking.locationType],
      ["Location", booking.address],
      ["Full name", booking.name],
      ["Phone / WhatsApp", booking.phone],
      ["Email", booking.email || "Not provided"],
      ["Extra notes", booking.notes || "None"]
    ];
    const list = $("#review-list");
    list.replaceChildren();
    rows.forEach(([label, value]) => {
      const row = document.createElement("div");
      row.className = "review-row";
      const dt = document.createElement("dt");
      dt.textContent = label;
      const dd = document.createElement("dd");
      dd.textContent = value;
      row.append(dt, dd);
      list.append(row);
    });
  }
  $("#review-button").addEventListener("click", () => {
    if (!validateStep(3)) return;
    makeReview();
    showStep(4);
  });
  $("#send-booking").addEventListener("click", () => {
    const booking = readBooking();
    const message = [
      "Hello House of Tifeh! I'd like to request a makeup appointment.",
      "",
      "BOOKING REQUEST",
      "Service: " + booking.service,
      "Occasion: " + booking.eventType,
      "Preferred date: " + prettyDate(booking.date),
      "Preferred time: " + prettyTime(booking.time),
      "Location type: " + booking.locationType,
      "Location: " + booking.address,
      "Full name: " + booking.name,
      "Phone / WhatsApp: " + booking.phone,
      "Email: " + (booking.email || "Not provided"),
      "Extra notes: " + (booking.notes || "None"),
      "",
      "I understand this is a request and the appointment is not confirmed until you reply. Please let me know if the date and time are available."
    ].join("\n");
    const waUrl = "https://wa.me/2348106707755?text=" + encodeURIComponent(message);
    window.open(waUrl, "_blank", "noopener,noreferrer");
    alertBox.textContent = "WhatsApp has been opened with your booking details. Please press Send in WhatsApp to deliver your request. Your appointment is not confirmed until the artist replies.";
  });

  const now = new Date();
  const eventDate = $("#event-date");
  eventDate.addEventListener("change", () => {
    if (eventDate.value && eventDate.value < localToday) {
      eventDate.value = "";
      eventDate.setAttribute("aria-invalid", "true");
      alertBox.textContent = "Please choose today or a future date.";
    }
  });
})();