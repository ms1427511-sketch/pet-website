const pets = [
  { id: 1, name: 'Max', age: 2, gender: 'Male', type: 'Dog', breed: 'Labrador', image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80', description: 'Friendly and energetic Labrador who loves park runs.' },
  { id: 2, name: 'Bella', age: 1, gender: 'Female', type: 'Cat', breed: 'Domestic Shorthair', image: 'https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=800&q=80', description: 'Playful kitten with a curious and affectionate personality.' },
  { id: 3, name: 'Charlie', age: 5, gender: 'Male', type: 'Dog', breed: 'Beagle', image: 'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?auto=format&fit=crop&w=800&q=80', description: 'Gentle Beagle who enjoys cuddles and slow walks.' },
  { id: 4, name: 'Luna', age: 4, gender: 'Female', type: 'Cat', breed: 'Siamese', image: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=800&q=80', description: 'Elegant Siamese cat that is calm, social, and house-trained.' },
  { id: 5, name: 'Rocky', age: 3, gender: 'Male', type: 'Dog', breed: 'German Shepherd', image: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=800&q=80', description: 'Loyal and smart companion, ideal for active families.' },
  { id: 6, name: 'Milo', age: 6, gender: 'Male', type: 'Cat', breed: 'Maine Coon', image: 'https://images.unsplash.com/photo-1574231164645-d6f0e8553590?auto=format&fit=crop&w=800&q=80', description: 'Calm and fluffy senior cat that enjoys quiet afternoons.' }
];

const ageGroup = (age) => (age <= 1 ? 'Puppy/Kitten' : age <= 3 ? 'Young' : 'Adult');
const page = document.body.dataset.page;

function petCard(pet) {
  return `<article class="card pet-card"><img src="${pet.image}" alt="${pet.name}"/><h3>${pet.name}</h3><p class="pet-meta">${pet.type} • ${pet.gender} • ${pet.age} years</p><button class="btn" onclick="viewDetails(${pet.id})">View Details</button></article>`;
}

function renderPets(data) {
  const grid = document.getElementById('petGrid');
  const count = document.getElementById('resultCount');
  const empty = document.getElementById('emptyState');
  if (!grid) return;
  grid.innerHTML = data.map(petCard).join('');
  if (count) count.textContent = `${data.length} pet(s) found`;
  if (empty) empty.classList.toggle('hidden', data.length > 0);
}

function applyFilters(defaultType = 'all') {
  const type = document.getElementById('filterType')?.value || defaultType;
  const age = document.getElementById('filterAge')?.value || 'all';
  const gender = document.getElementById('filterGender')?.value || 'all';

  const filtered = pets.filter((pet) =>
    (type === 'all' || pet.type === type) &&
    (age === 'all' || ageGroup(pet.age) === age) &&
    (gender === 'all' || pet.gender === gender)
  );
  renderPets(filtered);
}

function viewDetails(id) {
  localStorage.setItem('selectedPetId', id);
  window.location.href = 'details.html';
}
window.viewDetails = viewDetails;

function initDetails() {
  const el = document.getElementById('petDetails');
  if (!el) return;
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get('id') || localStorage.getItem('selectedPetId'));
  const pet = pets.find((p) => p.id === id);
  if (!pet) {
    el.innerHTML = '<p>Pet not found. Please return to listings.</p>';
    return;
  }
  el.innerHTML = `<div class="card"><img src="${pet.image}" alt="${pet.name}"/><h1>${pet.name}</h1><p><strong>Type:</strong> ${pet.type}</p><p><strong>Breed:</strong> ${pet.breed}</p><p><strong>Age:</strong> ${pet.age} years</p><p><strong>Gender:</strong> ${pet.gender}</p><p>${pet.description}</p><a class="btn" href="adoption.html">Adopt Now</a></div>`;
}

function setupForm(id, messageId, text) {
  const form = document.getElementById(id);
  const msg = document.getElementById(messageId);
  if (!form || !msg) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      msg.textContent = 'Please fill all required fields correctly.';
      msg.style.color = 'crimson';
      return;
    }
    msg.textContent = text;
    msg.style.color = 'green';
    form.reset();
  });
}

if (page === 'pets') {
  ['filterType', 'filterAge', 'filterGender'].forEach((id) => {
    document.getElementById(id)?.addEventListener('change', () => applyFilters());
  });
  applyFilters();
}
if (page === 'dogs') renderPets(pets.filter((p) => p.type === 'Dog'));
if (page === 'cats') renderPets(pets.filter((p) => p.type === 'Cat'));
if (page === 'details') initDetails();

setupForm('adoptionForm', 'adoptionMessage', 'Application submitted successfully! We will contact you soon.');
setupForm('contactForm', 'contactMessage', 'Message sent successfully!');
setupForm('volunteerForm', 'volunteerMessage', 'Thank you for volunteering with PawHome!');
