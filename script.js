const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  menuToggle.textContent = isOpen ? "×" : "☰";
});

nav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    menuToggle.textContent = "☰";
  });
});

// Car category filters
document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    const category = button.dataset.filter;
    document.querySelectorAll(".car-card").forEach(card => {
      card.hidden = category !== "all" && card.dataset.category !== category;
    });
  });
});

const today = new Date();
const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
const dateInputs = [
  document.getElementById("quickPickup"),
  document.getElementById("quickReturn"),
  document.getElementById("pickupDate"),
  document.getElementById("returnDate")
];
dateInputs.forEach(input => input.min = localDate);

function setReturnMinimum(pickupId, returnId) {
  const pickup = document.getElementById(pickupId);
  const returning = document.getElementById(returnId);
  pickup.addEventListener("change", () => {
    returning.min = pickup.value || localDate;
    if (returning.value && returning.value < pickup.value) returning.value = pickup.value;
  });
}
setReturnMinimum("quickPickup", "quickReturn");
setReturnMinimum("pickupDate", "returnDate");

document.getElementById("findCarBtn").addEventListener("click", () => {
  const pickup = document.getElementById("quickPickup").value;
  const returning = document.getElementById("quickReturn").value;
  const pickupField = document.getElementById("pickupDate");
  const returnField = document.getElementById("returnDate");
  if (pickup) pickupField.value = pickup;
  if (returning) returnField.value = returning;
  if (pickup) returnField.min = pickup;
  document.getElementById("booking").scrollIntoView({ behavior: "smooth" });
  if (!pickup || !returning) {
    document.getElementById("formMessage").textContent = "Choose your pickup and return dates to complete your enquiry.";
  } else if (returning < pickup) {
    document.getElementById("formMessage").textContent = "The return date must be on or after the pickup date.";
  } else {
    document.getElementById("formMessage").textContent = "";
  }
});

document.querySelectorAll(".choose-car").forEach(button => {
  button.addEventListener("click", () => {
    document.getElementById("carSelect").value = button.dataset.car;
    document.getElementById("booking").scrollIntoView({ behavior: "smooth" });
  });
});

const form = document.getElementById("bookingForm");
const message = document.getElementById("formMessage");
form.addEventListener("submit", event => {
  event.preventDefault();
  message.textContent = "";
  const data = new FormData(form);
  const name = String(data.get("fullName")).trim();
  const phone = String(data.get("phone")).trim();
  const car = String(data.get("car")).trim();
  const pickup = String(data.get("pickupDate"));
  const returning = String(data.get("returnDate"));

  if (!name || !phone || !car || !pickup || !returning) {
    message.textContent = "Please complete all required fields.";
    return;
  }
  if (returning < pickup) {
    message.textContent = "The return date must be on or after the pickup date.";
    document.getElementById("returnDate").focus();
    return;
  }

  const days = Math.max(1, Math.round((new Date(returning + "T12:00:00") - new Date(pickup + "T12:00:00")) / 86400000));
  const text = [
    "Hello! I'd like to make a car rental enquiry.",
    "",
    `Name: ${name}`,
    `My phone number: ${phone}`,
    `Preferred car: ${car}`,
    `Pickup date: ${pickup}`,
    `Return date: ${returning}`,
    `Rental duration: ${days} day(s)`,
    `Pickup location: ${String(data.get("pickupLocation") || "Not specified").trim()}`,
    `Additional details: ${String(data.get("notes") || "None").trim()}`,
    "",
    "Please confirm availability and the final rental price. Thank you!"
  ].join("\n");

  // Opens WhatsApp with the enquiry pre-filled. The user must press Send in WhatsApp.
  const whatsappNumber = "94760579428"; // Sri Lanka country code +94, without the leading 0
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  message.textContent = "Your enquiry is ready in WhatsApp. Please press Send there to contact us.";
});

document.getElementById("year").textContent = new Date().getFullYear();
