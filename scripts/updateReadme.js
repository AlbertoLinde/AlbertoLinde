const fs = require('fs');
const axios = require('axios');

async function getPokemonOfTheDay() {
  try {
    const response = await axios.get('https://pokeapi.co/api/v2/pokemon/');
    const data = response.data;
    const totalPokemon = data.count;
    const randomIndex = Math.floor(Math.random() * totalPokemon) + 1;
    const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${randomIndex}`;
    const pokemonResponse = await axios.get(pokemonUrl);
    const pokemonData = pokemonResponse.data;
    const name = pokemonData.name.toUpperCase();
    const imageUrl = pokemonData.sprites.other['official-artwork'].front_default;
    return { name, imageUrl };
  } catch (error) {
    console.error('Error fetching Pokémon:', error.message);
    return null;
  }
}

async function updatePokemonSection(name, imageSrc) {
  try {
    let readme = fs.readFileSync('./README.md', 'utf8');
    const startTag = '<!-- POKEMON START -->';
    const endTag = '<!-- POKEMON END -->';
    const startIndex = readme.indexOf(startTag) + startTag.length;
    const endIndex = readme.indexOf(endTag);
    const pokemonSection = readme.substring(startIndex, endIndex);

    const currentNumber = parseInt(pokemonSection.match(/Pokemon Generated: (\d+)/)[1]);
    const newNumber = currentNumber + 1;

    const newPokemonSection = `
  <div style="flex: 1; padding: 20px; text-align: center;">
    <h3>${name}</h3>
    <img src="${imageSrc}" alt="${name}" style="max-width: 200px; margin: 0 auto;" />
    <p style="font-size: 14px;">Pokemon Generated: ${newNumber}</p>
  </div>
`;

    const newReadme = readme.replace(pokemonSection, newPokemonSection);
    fs.writeFileSync('./README.md', newReadme, 'utf8');
    console.log('README updated successfully.');
  } catch (error) {
    console.error('Error updating README:', error.message);
  }
}

async function main() {
  const pokemon = await getPokemonOfTheDay();
  if (pokemon) {
    await updatePokemonSection(pokemon.name, pokemon.imageUrl);
  }
}

main();
