import { pokemonTypeColors } from "../utils";

export default function TypeCard(props) {
  const { type } = props;
  return (
    <div
      className="type-tile"
      // access the utils file & style text using css
      style={{
        color: pokemonTypeColors?.[type]?.color,
        background: pokemonTypeColors?.[type]?.background,
      }}
    >
      <p>{type}</p>
    </div>
  );
}
