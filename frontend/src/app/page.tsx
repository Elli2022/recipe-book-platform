import ReceptClient from "./recept/ReceptClient";

/** Startsidan = samma vy som /recept (ingen separat hero-landning). */
export default function Home() {
  return <ReceptClient showCreateForm={false} />;
}
