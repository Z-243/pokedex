import { useState } from "react";
import { first151Pokemon, getFullPokedexNumber } from "../utils";

export default function SideNav(props) {
  const { selectedPokemon, setSelectedPokemon, handleCloseMenu, showSideMenu } =
    props;
  const [searchValue, setSearchValue] = useState("");
  const filteredPokemon = first151Pokemon.filter((element, elementIndex) => {
    // if the search value(string) is included in full-pokedex-no(converted to srring) - return true
    if (getFullPokedexNumber(elementIndex).includes(searchValue)) {
      return true;
    }
    // if the search value is in pokemon name
    if (element.toLowerCase().includes(searchValue.toLowerCase())) {
      return true;
    }
    // otherwise exclude value from array
    return false;
  });

  // SideNav for wider screen navigation
  return (
    // if showSideMenu is true give class open
    <nav className={" " + (showSideMenu ? " open" : "")}>
      <div className={"header" + (showSideMenu ? " open" : "")}>
        {/* gives ShowMenu false value */}
        <button onClick={handleCloseMenu} className="open-nav-button">
          <i className="fa-solid fa-arrow-left-long"></i>
        </button>
        <h1 className="text-gradient">Pokédex</h1>
      </div>
      <input
        placeholder="E.g. 001 or Bulba.."
        value={searchValue}
        onChange={(e) => {
          setSearchValue(e.target.value); // get current value
        }}
      />
      {filteredPokemon.map((pokemon, pokemonIndex) => {
        const truePokedexNumber = first151Pokemon.indexOf(pokemon);
        return (
          <button
            onClick={() => {
              setSelectedPokemon(truePokedexNumber);
              handleCloseMenu();
            }}
            key={pokemonIndex}
            className={
              "nav-card" +
              (pokemonIndex === selectedPokemon ? " nav-card-selected" : " ")
            }
          >
            {/* string FullpokedexNumber displayed*/}
            <p>{getFullPokedexNumber(truePokedexNumber)}</p>
            <p>{pokemon}</p>
          </button>
        );
      })}
    </nav>
  );
}
