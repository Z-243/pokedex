import Header from "./components/Header";
import PokeCard from "./components/PokeCard";
import SideNav from "./components/SideNav";

import { useState } from "react";

function App() {
  // initialise selectedPokemon at the 0th index; useState returns an array,so for  array destructuring [] are needed
  const [selectedPokemon, setSelectedPokemon] = useState(0);
  const [showSideMenu, setShowSideMenu] = useState(false);

  function handleToogleMenu() {
    //changes show state from false to true & vice-versa
    setShowSideMenu(!showSideMenu);
  }

  function handleCloseMenu() {
    setShowSideMenu(false);
  }

  return (
    <>
      <Header handleToogleMenu={handleToogleMenu} />
      <SideNav
        // sent to sideNav so it later be destructured
        selectedPokemon={selectedPokemon}
        setSelectedPokemon={setSelectedPokemon}
        handleCloseMenu={handleCloseMenu}
        showSideMenu={showSideMenu}
      />
      <PokeCard selectedPokemon={selectedPokemon} />
    </>
  );
}

export default App;
