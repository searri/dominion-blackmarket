// script.js
let cardDataset = [];

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
        console.log("Dataset loaded:", cardDataset.length, "cards");
    } catch (err) {
        console.error("Error loading JSON:", err);
    }
}

function drawCards() {
    if (cardDataset.length < 3) {
        alert("Not enough cards in data.json!");
        return;
    }
    const shuffled = [...cardDataset].sort(() => 0.5 - Math.random());
    displayCards(shuffled.slice(0, 3));
}

function displayCards(cards) {
    cardContainer.innerHTML = '';
    cards.forEach(card => {
        const cardEl = document.createElement('div');
        // Added dark:bg-gray-800 and dark:border-gray-700
        cardEl.className = "bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-4 transition-all max-w-sm mx-auto";
        
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