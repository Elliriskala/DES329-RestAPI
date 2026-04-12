let allPokemons = [];

document.addEventListener("DOMContentLoaded", () => {
    fetchPokemons();
    setupEventListeners();
});

const typeColors = {
    Grass: "var(--type-grass)", Poison: "var(--type-poison)",
    Fire: "var(--type-fire)", Water: "var(--type-water)",
    Bug: "var(--type-bug)", Flying: "var(--type-flying)",
    Normal: "var(--type-normal)"
};

async function fetchPokemons() {
    toggleLoading(true);
    try {
        const response = await fetch("/api/pokemons");
        const json = await response.json();
        if (response.ok && json.data) {
            allPokemons = json.data;
            renderView();
        } else {
            showError("Failed to load Pokemon.");
        }
    } catch (error) {
        showError("Network error.");
    }
}

function renderView() {
    renderReporting();
    
    // Filter logic
    const query = document.getElementById("search-input").value.toLowerCase();
    const filtered = allPokemons.filter(p => {
        const textMatch = p.name.toLowerCase().includes(query) || (p.types && p.types.some(t => t.toLowerCase().includes(query)));
        return textMatch;
    });

    renderCards(filtered);
}

function renderCards(pokemons) {
    const container = document.getElementById("pokemon-container");
    container.innerHTML = "";
    if(pokemons.length === 0) {
        container.innerHTML = `<div class="loading-state"><p>No Pokemon Found.</p></div>`;
        return;
    }
    
    pokemons.forEach((pokemon, index) => {
        const card = createPokemonCard(pokemon);
        card.style.animationDelay = `${(index % 10) * 0.05}s`;
        container.appendChild(card);
    });
}

function renderReporting() {
    const totalEl = document.getElementById("stat-total");
    const hpEl = document.getElementById("stat-hp");
    const cpEl = document.getElementById("stat-cp");

    totalEl.textContent = allPokemons.length;
    
    if (allPokemons.length === 0) {
        hpEl.textContent = '0';
        cpEl.textContent = '0';
        return;
    }

    const totalHp = allPokemons.reduce((acc, p) => acc + (p.hp || 0), 0);
    const totalCp = allPokemons.reduce((acc, p) => acc + (p.cp || 0), 0);

    hpEl.textContent = Math.round(totalHp / allPokemons.length);
    cpEl.textContent = Math.round(totalCp / allPokemons.length);
}

function createPokemonCard(pokemon) {
    const card = document.createElement("article");
    card.className = "pokemon-card";
    const imgUrl = pokemon.picture || "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/025.png";
    
    card.innerHTML = `
        <img src="${imgUrl}" alt="${pokemon.name}" loading="lazy">
        <h2>${pokemon.name}</h2>
        <div class="stats-container">
            <div class="stat">HP <span>${pokemon.hp || '?'}</span></div>
            <div class="stat">CP <span>${pokemon.cp || '?'}</span></div>
        </div>
        <div class="types-container">
            ${(pokemon.types || []).map(t => `<span class="type-badge" style="background: ${typeColors[t] || "var(--type-normal)"}">${t}</span>`).join('')}
        </div>
        <div class="card-actions">
            <button class="action-btn edit-btn" onclick="openModal('${pokemon._id}')">Edit</button>
            <button class="action-btn delete-btn" onclick="deletePokemon('${pokemon._id}')">Delete</button>
        </div>
    `;
    return card;
}

// ------ Event Listeners & CRUD Handlers ------
function setupEventListeners() {
    document.getElementById("search-input").addEventListener("input", renderView);
    document.getElementById("add-btn").addEventListener("click", () => openModal());
    document.getElementById("close-modal").addEventListener("click", closeModal);
    document.getElementById("pokemon-form").addEventListener("submit", handleFormSubmit);
    
    // Close modal on click outside
    document.getElementById("pokemon-modal").addEventListener("click", (e) => {
        if(e.target === document.getElementById("pokemon-modal")) closeModal();
    });
}

function toggleLoading(show) {
    const container = document.getElementById("pokemon-container");
    if(show) {
        container.innerHTML = `<div class="loading-state"><div class="spinner"></div><p>Catching Data...</p></div>`;
    }
}

function showError(msg) {
    const container = document.getElementById("pokemon-container");
    container.innerHTML = `<div class="loading-state"><p style="color:#f87171">${msg}</p></div>`;
}

/* Modals */
function openModal(id = null) {
    const modal = document.getElementById("pokemon-modal");
    const title = document.getElementById("modal-title");
    const form = document.getElementById("pokemon-form");
    
    form.reset();
    document.getElementById("form-id").value = "";

    if (id) {
        title.textContent = "Edit Pokemon";
        const pokemon = allPokemons.find(p => p._id === id);
        if (pokemon) {
            document.getElementById("form-id").value = pokemon._id;
            document.getElementById("form-name").value = pokemon.name;
            document.getElementById("form-hp").value = pokemon.hp;
            document.getElementById("form-cp").value = pokemon.cp;
            document.getElementById("form-picture").value = pokemon.picture;
            document.getElementById("form-types").value = (pokemon.types || []).join(", ");
        }
    } else {
        title.textContent = "Add Pokemon";
    }
    
    modal.classList.remove("hidden");
}

function closeModal() {
    document.getElementById("pokemon-modal").classList.add("hidden");
}

/* Create / Update */
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const id = document.getElementById("form-id").value;
    const typesStr = document.getElementById("form-types").value;
    
    const payload = {
        name: document.getElementById("form-name").value,
        hp: parseInt(document.getElementById("form-hp").value),
        cp: parseInt(document.getElementById("form-cp").value),
        picture: document.getElementById("form-picture").value,
        types: typesStr.split(",").map(t => t.trim()).filter(t => t)
    };

    const method = id ? "PUT" : "POST";
    const url = id ? `/api/pokemon/${id}` : "/api/pokemons";

    try {
        const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        
        if (response.ok) {
            closeModal();
            fetchPokemons(); // Refresh entire list simply
        } else {
            alert("Failed to save Pokemon.");
        }
    } catch(err) {
        console.error(err);
        alert("Network error.");
    }
}

/* Delete */
async function deletePokemon(id) {
    if (!confirm("Are you sure you want to release this Pokemon? It will be deleted forever!")) return;
    
    try {
        const response = await fetch(`/api/pokemon/${id}`, { method: "DELETE" });
        if (response.ok) {
            allPokemons = allPokemons.filter(p => p._id !== id);
            renderView();
        } else {
            alert("Failed to delete Pokemon.");
        }
    } catch(err) {
        console.error(err);
        alert("Network error deleting Pokemon.");
    }
}
