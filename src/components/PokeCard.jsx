import { useEffect, useState } from "react";
import { getFullPokedexNumber, getPokedexNumber } from "../utils";
import TypeCard from "./TypeCard";
import Modal from "./Modal";

export default function PokeCard(props) {
  const { selectedPokemon } = props;
  // actual pokemon data; set it to null so we know when the pokemon is avaiable or not
  const [data, setData] = useState(null);
  // false - when we 1st load the page we arn't loading anything later we fetch the info
  const [loading, setLoading] = useState(false);
  // need to fetch data about skill separately
  const [skill, setSkill] = useState(null);
  // loading state for the skills - so we can prevent the user from double loading
  const [loadingSkill, setLoadingSkill] = useState(false);
  // if data is null destructure out of empty object
  const { name, height, abilities, stats, types, moves, sprites } = data || {};
  // gives an array of keys from sprites object which contains the main pokemon images
  const imgList = Object.keys(sprites || {}).filter((val) => {
    // if we access a key & it returns undefined then filter it out
    if (!sprites[val]) {
      return false;
    }
    //  filter out the various pokemon versions as we only want the main ones
    if (["versions", "other"].includes(val)) {
      return false;
    }
    return true;
  });

  async function fetchMoveData(move, moveUrl) {
    if (loadingSkill || !localStorage || !moveUrl) {
      return;
    }

    // check cache for move
    let cacheMoves = {};
    if (localStorage.getItem("pokemon-moves")) {
      cacheMoves = JSON.parse(localStorage.getItem("pokemon-moves"));
    }

    if (move in cacheMoves) {
      setSkill(cacheMoves[move]);
      console.log("found move in cache");
      return;
    }

    try {
      setLoadingSkill(true);
      const res = await fetch(moveUrl);
      const moveData = await res.json();
      console.log("Fetched move from API:", move);

      const flavorEntry = moveData?.flavor_text_entries.find(
        (val) => val.version_group.name === "firered-leafgreen"
      );
      const description =
        flavorEntry?.flavor_text || "No description available.";

      const skillData = {
        name: move,
        description,
      };

      setSkill(skillData);
      cacheMoves[move] = skillData;
      localStorage.setItem("pokemon-moves", JSON.stringify(cacheMoves));
    } catch (err) {
      console.error("Error fetching move data:", err.message);
    } finally {
      setLoadingSkill(false);
    }
  }

  // function runs whenever selectedPokemon value changes
  useEffect(() => {
    // guard clause - if already loading/fetching or no access to localStorage, exit logic
    if (loading || !localStorage) {
      return;
    }

    // check if pokedex is available in the storage, if yes get its data
    // 1. define the cache
    let cache = {};
    if (localStorage.getItem("pokedex")) {
      cache = JSON.parse(localStorage.getItem("pokedex"));
    }

    // 2. check if the selected pokemon is in the cache, if not fetch from the API

    if (selectedPokemon in cache) {
      // read from cache
      setData(cache[selectedPokemon]);
      console.log("Found pokemon in cache");
      return;
    }
    // if selectedPokemon not in cache, fetch data
    async function fetchPokemonData() {
      // so if this function is invoked again when its loading we exit out of it
      setLoading(true);
      try {
        const url = `https://pokeapi.co/api/v2/pokemon/${getPokedexNumber(
          selectedPokemon
        )}`;
        const res = await fetch(url);
        const pokemonData = await res.json();
        setData(pokemonData);
        console.log("Fetched Pokemon from API");

        //update the cache
        cache[selectedPokemon] = pokemonData;
        localStorage.setItem("pokedex", JSON.stringify(cache));
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPokemonData();

    // if we fetch from the API, make sure to save the information to the cache for next time
  }, [selectedPokemon]);

  // if loading or the data doen't exist show Loading....
  if (loading || !data) {
    return (
      <div>
        <h4>Loading....</h4>
      </div>
    );
  }

  return (
    <div className="poke-card">
      {/* import modal; content written b/w modal divs becomes the {children} */}
      {/* conditional statement - runs only after condition is met; if skill is true render it out*/}
      {skill && (
        <Modal
          handleCloseModal={() => {
            setSkill(null); // no skill to show modal closed
          }}
        >
          <div>
            <h6>Name</h6>
            <h2 className="skill-name">{skill.name.replaceAll("-", " ")}</h2>
          </div>
          <div>
            <h6>Description</h6>
            <p>{skill.description}</p>
          </div>
        </Modal>
      )}
      <div>
        <h4>#{getFullPokedexNumber(selectedPokemon)}</h4>
        <h2>{name}</h2>
      </div>
      {/* map over different pokemon types */}
      <div className="type-container">
        {types.map((typeObj, typeIndex) => {
          // see if typeObj or value exists then access the type then the name(this is how the data is arranged in localStorage)
          // send the data to TypeCard
          return <TypeCard key={typeIndex} type={typeObj?.type?.name} />;
        })}
      </div>
      {/* src - public folder is the default folder so simply write pokemon */}
      {/* src accesses the pokemon folder then runs getFullPokedexNumber() func. to get the value */}
      <img
        className="default-img"
        src={"/pokemon/" + getFullPokedexNumber(selectedPokemon) + ".png"}
        alt={`${name}-large-img`}
      />
      <div className="img-container">
        {imgList.map((spriteUrl, spriteIndex) => {
          const imgUrl = sprites[spriteUrl]; //gives us the key
          return (
            <img
              key={spriteIndex}
              src={imgUrl}
              alt={`${name}-img-${spriteUrl}`}
            />
          );
        })}
      </div>
      <h3>Stats</h3>
      <div className="stats-card">
        {stats.map((statObj, statIndex) => {
          // destructure stat, base_stat
          const { stat, base_stat } = statObj;
          return (
            <div key={statIndex} className="stat-item">
              {/* stat name */}
              <p>{stat?.name.replace("-", " ")}</p>
              {/* stat numbers */}
              <h4>{base_stat}</h4>
            </div>
          );
        })}
      </div>
      <h3>Moves</h3>
      <div className="pokemon-move-grid">
        {moves
          .slice() // creates a copy of an array; Prevents modifying the original moves array
          .sort((a, b) => a.move.name.localeCompare(b.move.name))
          .map((moveObj, moveIndex) => {
            return (
              <button
                key={moveIndex}
                className="button-card pokemon-move"
                onClick={() => {
                  fetchMoveData(moveObj?.move?.name, moveObj?.move?.url);
                }}
              >
                <p>{moveObj?.move?.name.replaceAll("-", " ")}</p>
              </button>
            );
          })}
      </div>
    </div>
  );
}
