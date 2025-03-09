let maxPoke = 151;
const listWrap = document.querySelector('.list-wrap');
const searInp = document.querySelector('#searching');
const num = document.querySelector('#number');
const nameFilter = document.querySelector('#name');
const notFound = document.querySelector('#not-found');
const closeButton = document.querySelector("#search-close");

let allPokemons = [];
async function Loader() {
    try {
        // Fetch the total number of Pokémon
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon`);
        if (!res.ok) {
            throw new Error("Not Found");
        }
        const c = await res.json();
        console.log(c);
        // maxPoke= c.count;
        // Fetch Pokémon list
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${maxPoke}`);
        if (!response.ok) {
            throw new Error("Not Found");
        }
        const data = await response.json();
        allPokemons = await data.results;
        displayPokemon(allPokemons);

        async function fetchPokemonA(id) {
            try {
                const [pokemon, pokeSpecies] = await Promise.all([fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
                    .then((res) => {
                        res.json();
                    }),
                fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
                    .then((res) => {
                        res.json();
                    })
                ]);
                return true;
            }
            catch (error) {
                console.log(error);
            }
        }
        async function displayPokemon(pokemon) {
            listWrap.innerHTML = "";

            pokemon.forEach(
                async (pokemon) => {
                    const PokeID = pokemon.url.split("/")[6];
                    const listItem = document.createElement("div");
                    listItem.className = "list-item";
                    listItem.innerHTML = `
                       <div class="pokemon-card">
                        <div class="number-wrap">
                        <p class="caption">
                        #${PokeID.toString().padStart(4, '0')}
                        </p>
                        </div>
                        <div class="img-wrap img-fluid">
                        <img class="pokeImg" src="" alt="">
                        </div>
                        <div class="name-wrap">
                        <p class="name-pok">
                        </p>
                        </div>
                       </div>
                    `;
                    const eachPoke = await fetch(pokemon.url);
                    if (!eachPoke.ok) {
                        throw new Error("Not Found");
                    }
                    const pokedata = await eachPoke.json();
                    // console.log(pokedata);
                    const Psprite = pokedata.sprites.front_default;
                    const pokeImg = listItem.querySelector('.pokeImg');
                    pokeImg.src = Psprite;
                    pokeImg.alt = `${pokemon.name}`;
                    const pocketName = listItem.querySelector('.name-pok');
                    pocketName.innerHTML = `${pokemon.name}`;
                    if (Psprite != null) {
                        document.querySelector('.list-wrap').appendChild(listItem);
                    }

                    listItem.addEventListener("click", async () => {
                        const success = await fetchPokemonA(PokeID);
                        if (success) {
                            window.location.href = `./Details/sole.html?id=${PokeID}`;
                        }
                    });
                }
            )
        }
        searInp.addEventListener("keyup", searchHandler);
        function searchHandler() {
            const searchTerm = searInp.value.toLowerCase();
            let filteredPokemons;
            console.log(num.checked);
            console.log(nameFilter.checked);
            if (num.checked) {
                filteredPokemons = allPokemons.filter(
                    (pokemon) => {
                        const PokeID = pokemon.url.split("/")[6];
                        return PokeID.startsWith(searchTerm);
                    }
                );
            }
            else if (nameFilter.checked) {
                filteredPokemons = allPokemons.filter(
                    (pokemon) => {
                        return pokemon.name.toLowerCase().startsWith(searchTerm);
                    }
                )
            }
            else {
                filteredPokemons = allPokemons;
            }

            displayPokemon(filteredPokemons);

            if (filteredPokemons.length === 0) {
                notFound.style.display = "block";
            }
            else {
                notFound.style.display = "none";
            }
        }
        // Handle search clear button
        closeButton.addEventListener("click", clearSearch);

        function clearSearch() {
            searInp.value = "";
            displayPokemon(allPokemons);
            notFound.style.display = "none";
        }
    }
    catch (Error) {
        console.log(Error);
    }
}

Loader();

