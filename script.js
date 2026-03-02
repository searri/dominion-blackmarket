let cardDataset = [];
let currentSelection = []; // Track the 3 card objects currently shown

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

// Function to draw 3 entirely new cards
function drawAllCards() {
    if (cardDataset.length < 3) return alert("Not enough cards!");
    
    // Shuffle and pick 3
    const shuffled = [...cardDataset].sort(() => 0.5 - Math.random());
    currentSelection = shuffled.slice(0, 3);
    
    renderUI();
}

// Function to replace just ONE card at a specific index
window.replaceSingleCard = function(index) {
    // Get names of cards currently on screen to avoid duplicates
    const activeNames = currentSelection.map(c => c.name);
    const availablePool = cardDataset.filter(card => !activeNames.includes(card.name));

    if (availablePool.length === 0) return alert("No more unique cards left!");

    // Pick one new card and swap it into the array
    const newCard = availablePool[Math.floor(Math.random() * availablePool.length)];
    currentSelection[index] = newCard;
    
    renderUI();
};

function renderUI() {
    cardContainer.innerHTML = '';
    
    currentSelection.forEach((card, index) => {
        const cardEl = document.createElement('div');
        // Added flex layout to keep button at bottom
        cardEl.className = "bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-4 max-w-sm mx-auto animate-fade-in flex flex-col";
        
        // Staggered animation delay
        cardEl.style.animationDelay = `${index * 150}ms`;
        cardEl.style.animationFillMode = "forwards";

        cardEl.innerHTML = `
            <img src="${card.image}" 
                alt="${card.name}" 
                class="w-full h-auto rounded-md mb-4 shadow-sm"
                width="800" height="1280">
            <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">${card.name}</h3>
            <button onclick="replaceSingleCard(${index})" 
                class="mt-auto bg-gray-200 dark:bg-gray-700 hover:bg-red-800 dark:hover:bg-red-900 hover:text-white text-gray-700 dark:text-gray-200 py-2 px-4 rounded-lg transition-colors text-sm font-bold">
                Replace This Card
            </button>
        `;
        cardContainer.appendChild(cardEl);
    });

    mainView.classList.add('hidden');
    cardView.classList.remove('hidden');
}

// Theme Logic
themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    themeIcon.innerText = isDark ? '☀️' : '🌙';
});

// Event Listeners - Pointing to the new unified function
document.getElementById('randomize-btn').addEventListener('click', drawAllCards);
document.getElementById('redraw-btn').addEventListener('click', drawAllCards);

loadData();