import Link from "next/link";
import RecipeImage from "../UI/RecipeImage";
import CategoryTag from "../UI/CategoryTag";
import styles from "./HomeHero.module.scss";
import type { Recipe } from "../../types/recipes";

type HomeHeroProps = {
  heroRecipe: Recipe | null;
  heroImage: string;
};

export default function HomeHero({ heroRecipe, heroImage }: HomeHeroProps) {
  return (
    <header className={styles.hero}>
      <div className={styles.heroContent}>
        <p className={styles.kicker}>Receitas afetivas e cheias de historia</p>
        <h1>Receitas do Marcelo</h1>
        <p className={styles.lede}>
          Um caderno digital de receitas familiares, pratos especiais e sabores
          que aquecem a cozinha e a mesa.
        </p>
        <div className={styles.heroActions}>
          <a href="#receitas" className={styles.primaryButton}>
            Explorar receitas
          </a>
        </div>
      </div>
      {heroRecipe ? (
        <div className={styles.heroCard}>
          <div className={styles.heroCardImage}>
            <RecipeImage
              src={heroImage}
              alt={heroRecipe.titulo}
              width={560}
              height={420}
              sizes="(max-width: 1024px) 90vw, 480px"
              priority
            />
          </div>
          <div className={styles.heroCardBody}>
            <p className={styles.cardTag}>Destaque da semana</p>
            <h2>{heroRecipe.titulo}</h2>
            <p className={styles.cardSummary}>{heroRecipe.resumo}</p>
            <Link href={`/receitas/${heroRecipe.slug}`} className={styles.link}>
              Ver receita completa
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
