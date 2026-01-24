// script.js
let cardDataset = [];
let currentCardNames = []; // Track names of cards currently on screen

const mainView = document.getElementById('main-view');
const cardView = document.getElementById('card-view');
const cardContainer = document.getElementById('card-container');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-toggle-icon');

async function loadData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error("Could not find data.json");
        cardDataset = await response.json();
    } catch (err) {
        console.error("Error loading JSON:", err);
    }
}

function drawCards() {
    // 1. Filter out cards that are currently displayed
    const availablePool = cardDataset.filter(card => !currentCardNames.includes(card.name));

    // 2. Safety check: if pool is too small, fallback to full dataset (minus current)
    if (availablePool.length < 3) {
        alert("Not enough unique cards left to draw. Resetting pool!");
        displayCards(cardDataset.sort(() => 0.5 - Math.random()).slice(0, 3));
        return;
    }

    // 3. Shuffle and pick 3
    const shuffled = [...availablePool].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);

    // 4. Update the tracker
    currentCardNames = selected.map(c => c.name);

    displayCards(selected);
}

function displayCards(cards) {
    cardContainer.innerHTML = '';
    cards.forEach((card, index) => {
        const cardEl = document.createElement('div');
        
        // Added 'opacity-0' and 'animate-fade-in' for a smooth transition
        cardEl.className = "bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-4 max-w-sm mx-auto animate-fade-in";
        
        // Apply a slight delay to each card for a staggered effect
        cardEl.style.animationDelay = `${index * 150}ms`;
        cardEl.style.animationFillMode = "forwards";

        cardEl.innerHTML = `
            <img src="${card.image}" 
                 alt="${card.name}" 
                 class="w-full h-auto rounded-md mb-4 shadow-sm"
                 width="800" height="1280">
            <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-200">${card.name}</h3>
        `;
        cardContainer.appendChild(cardEl);
    });

    mainView.classList.add('hidden');
    cardView.classList.remove('hidden');
}

// Draw logic
function drawCards() {
    if (cardDataset.length < 3) return alert("Not enough cards!");
    const shuffled = [...cardDataset].sort(() => 0.5 - Math.random());
    displayCards(shuffled.slice(0, 3));
}

// Dark Mode Toggle Logic
themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    themeIcon.innerText = isDark ? '☀️' : '🌙';
});

// Event Listeners
document.getElementById('randomize-btn').addEventListener('click', drawCards);
document.getElementById('redraw-btn').addEventListener('click', drawCards);

loadData();