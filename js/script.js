/* ---------------------------------
   PawHome Data Store (Frontend Only)
---------------------------------- */
const pets = [
  {
    id: 1,
    name: "Max",
    type: "dog",
    age: 2,
    gender: "male",
    image:
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80",
    description: "Friendly and energetic Labrador mix who loves outdoor play.",
  },
  {
    id: 2,
    name: "Bella",
    type: "cat",
    age: 1,
    gender: "female",
    image:
      "https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=900&q=80",
    description: "Sweet kitten that enjoys toys, climbing, and warm naps.",
  },
  {
    id: 3,
    name: "Charlie",
    type: "dog",
    age: 5,
    gender: "male",
    image:
      "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?auto=format&fit=crop&w=900&q=80",
    description: "Gentle Beagle with calm energy and excellent home manners.",
  },
  {
    id: 4,
    name: "Luna",
    type: "cat",
    age: 4,
    gender: "female",
    image:
      "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=900&q=80",
    description: "Quiet and affectionate cat who loves peaceful environments.",
  },
  {
    id: 5,
    name: "Rocky",
    type: "dog",
    age: 3,
    gender: "male",
    image:
      "https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=900&q=80",
    description: "Loyal German Shepherd mix, smart and great with routines.",
  },
  {
    id: 6,
    name: "Milo",
    type: "cat",
    age: 6,
    gender: "male",
    image:
      "https://images.unsplash.com/photo-1574231164645-d6f0e8553590?auto=format&fit=crop&w=900&q=80",
    description: "Maine Coon with a calm temperament and very social behavior.",
  },
  {
    id: 7,
    name: "Daisy",
    type: "dog",
    age: 1,
    gender: "female",
    image:
      "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80",
    description: "Young rescue pup, playful with children and quick to learn.",
  },
  {
    id: 8,
    name: "Coco",
    type: "cat",
    age: 2,
    gender: "female",
    image:
      "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=900&q=80",
    description: "Curious and cuddly cat who enjoys window watching.",
  },
];

/* ------------------------------
   Utility Functions
------------------------------- */
const page = document.body.dataset.page;

function toTitle(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function ageBand(age) {
  if (age <= 1) return "baby";
  if (age <= 3) return "young";
  return "adult";
}

function petCardTemplate(pet) {
  return `
    <article class="pet-card">
      <img src="${pet.image}" alt="${pet.name}" />
      <h3>${pet.name}</h3>
      <p class="pet-meta">${toTitle(pet.type)} • ${pet.age} year(s) • ${toTitle(
    pet.gender
  )}</p>
      <button class="btn" type="button" data-id="${pet.id}">View Details</button>
    </article>
  `;
}

function renderPetGrid(filteredPets) {
  const grid = document.getElementById("petGrid");
  const count = document.getElementById("resultCount");
  const empty = document.getElementById("emptyState");

  if (!grid) return;

  grid.innerHTML = filteredPets.map(petCardTemplate).join("");
  count.textContent = `${filteredPets.length} pet(s) found`;
  empty.classList.toggle("hidden", filteredPets.length > 0);

  // Add click event for all rendered detail buttons
  grid.querySelectorAll("button[data-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const selectedId = Number(button.dataset.id);
      localStorage.setItem("selectedPetId", String(selectedId));
      window.location.href = "details.html";
    });
  });
}

/* ------------------------------
   Pets Filtering Controller
------------------------------- */
function applyFilters(defaultType = "all") {
  const type = document.getElementById("filterType")?.value ?? defaultType;
  const age = document.getElementById("filterAge")?.value ?? "all";
  const gender = document.getElementById("filterGender")?.value ?? "all";

  const filtered = pets.filter((pet) => {
    const matchType = type === "all" || pet.type === type;
    const matchAge = age === "all" || ageBand(pet.age) === age;
    const matchGender = gender === "all" || pet.gender === gender;
    return matchType && matchAge && matchGender;
  });

  renderPetGrid(filtered);
}

function initPetsPage() {
  ["filterType", "filterAge", "filterGender"].forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener("change", () => applyFilters());
    }
  });
  applyFilters();
}

/* ------------------------------
   Dedicated Dog/Cat Pages
------------------------------- */
function initTypePage(type) {
  const onlyType = pets.filter((pet) => pet.type === type);
  renderPetGrid(onlyType);
}

/* ------------------------------
   Pet Details Controller
------------------------------- */
function initDetailsPage() {
  const container = document.getElementById("petDetails");
  if (!container) return;

  const selectedId = Number(localStorage.getItem("selectedPetId"));
  const pet = pets.find((item) => item.id === selectedId);

  if (!pet) {
    container.innerHTML =
      '<article class="panel"><h1>Pet not found</h1><p>Please return to Available Pets and choose a pet profile.</p></article>';
    return;
  }

  container.innerHTML = `
    <article class="panel">
      <img src="${pet.image}" alt="${pet.name}" />
      <h1>${pet.name}</h1>
      <p><strong>Type:</strong> ${toTitle(pet.type)}</p>
      <p><strong>Age:</strong> ${pet.age} year(s)</p>
      <p><strong>Gender:</strong> ${toTitle(pet.gender)}</p>
      <p>${pet.description}</p>
      <a class="btn" href="adoption.html">Adopt Now</a>
    </article>
  `;
}

/* ------------------------------
   Shared Form Validation
------------------------------- */
function setupFormValidation(formId, messageId, successMessage) {
  const form = document.getElementById(formId);
  const message = document.getElementById(messageId);

  if (!form || !message) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      message.textContent = "Please complete all required fields correctly.";
      message.style.color = "#b21458";
      return;
    }

    message.textContent = successMessage;
    message.style.color = "#1f7a35";
    form.reset();
  });
}

/* ------------------------------
   App Router (By Page)
------------------------------- */
if (page === "pets") initPetsPage();
if (page === "dogs") initTypePage("dog");
if (page === "cats") initTypePage("cat");
if (page === "details") initDetailsPage();

setupFormValidation(
  "adoptionForm",
  "adoptionMessage",
  "Application submitted successfully! We will contact you soon."
);
setupFormValidation("contactForm", "contactMessage", "Message sent successfully.");
setupFormValidation(
  "volunteerForm",
  "volunteerMessage",
  "Thank you for volunteering with PawHome!"
);
