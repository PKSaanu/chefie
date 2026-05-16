import { HomeShell } from "@/components/home/home-shell";
import { getCuisines } from "@/lib/data/get-cuisines";

export default async function HomePage() {
  const cuisines = await getCuisines();

  return <HomeShell cuisines={cuisines} />;
}
