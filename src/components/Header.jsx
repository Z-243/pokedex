export default function Header(props) {
  // Header for mobile screen navigation

  const { handleToogleMenu } = props;
  return (
    <header>
      <button onClick={handleToogleMenu} className="open-nav-button">
        <i className="fa-solid fa-bars"></i>
      </button>
      <h1 className="text-gradient">Pokédex</h1>
    </header>
  );
}
