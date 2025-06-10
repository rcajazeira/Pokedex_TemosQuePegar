let pokemonData = [];
let allPokemonData = []; // Vamos armazenar todos os pokémons aqui

// Carregar dados dos Pokémon
async function loadPokemonData() {
  try {
    // Mostrar loader enquanto carrega
    showLoader();
    
    // Consultar a API de pokémons da primeira geração
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151&offset=0");
    
    if (!response.ok) {
      throw new Error('Falha ao carregar os dados dos Pokémon');
    }
    
    const data = await response.json();
    allPokemonData = data.results;
    
    // Carregar dados completos para cada Pokémon (para obter a imagem)
    const pokemonDetails = await Promise.all(
      allPokemonData.map(pokemon => 
        fetch(pokemon.url).then(res => res.json())
      )
    );
    
    // Armazenar dados completos
    pokemonData = pokemonDetails;
    
    // Renderizar a lista inicial
    renderPokemonList(pokemonData);
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
    showMessage("Erro ao carregar os dados dos Pokémon");
  }
}

// Função para mostrar loader
function showLoader() {
  const pokemonList = document.querySelector(".pokemon-list");
  pokemonList.innerHTML = '<div class="loader"></div>';
}

// Função para mostrar mensagem
function showMessage(message) {
  const pokemonList = document.querySelector(".pokemon-list");
  pokemonList.innerHTML = `<p class="message">${message}</p>`;
}

// Função para renderizar a lista de Pokémon
function renderPokemonList(pokemons) {
  const pokemonList = document.querySelector(".pokemon-list");
  
  if (pokemons.length === 0) {
    showMessage("Nenhum Pokémon encontrado");
    return;
  }
  
  pokemonList.innerHTML = pokemons.map(pokemon => {
    return `
      <li class="pokemon-list__pokemon">
        <img src="${pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}" alt="${pokemon.name}">
        <div>
          <h2>${pokemon.name}</h2>
          <h6>#${String(pokemon.id).padStart(3, '0')}</h6>   
        </div>
      </li>
    `;
  }).join("");
}

// Função para buscar Pokémon
function searchPokemon(searchTerm) {
  if (!searchTerm.trim()) {
    // Se o campo estiver vazio, mostra todos os pokémons
    renderPokemonList(pokemonData);
    return;
  }
  
  const term = searchTerm.toLowerCase().trim();
  
  // Filtrar os pokémons que correspondem ao termo de busca
  const filteredPokemons = pokemonData.filter(pokemon => 
    pokemon.name.toLowerCase().includes(term)
  );
  
  renderPokemonList(filteredPokemons);
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  // Carregar dados dos Pokémon
  loadPokemonData();
  
  // Configurar evento de busca
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');
  
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    searchPokemon(searchInput.value);
  });
  
  // Busca em tempo real (opcional)
  searchInput.addEventListener('input', () => {
    searchPokemon(searchInput.value);
  });
});
