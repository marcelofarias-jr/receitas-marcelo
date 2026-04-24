export const dynamic = "force-dynamic";

import styles from "./page.module.scss";
import { listarReceitas } from "../controllers/receitasController";
import ContactForm from "../components/ContactForm";
import RecipesClientSection from "../components/RecipesClientSection";

export default async function Home() {
  const result = await listarReceitas(true);
  const recipes = result.error ? [] : result.data;

  return (
    <div className={styles.page}>
      <RecipesClientSection initialRecipes={recipes} />

      <section className={styles.contactSection}>
        <div className={styles.contactInner}>
          <div className={styles.contactHeader}>
            <h2>Fale comigo</h2>
            <p>
              Tem uma sugestão de receita, uma dúvida ou só quer mandar um alô?
              Preencha o formulário abaixo e responderei assim que possível.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>

      <footer className={styles.footer}>
        <p>Receitas do Marcelo - feito com carinho para reunir a familia.</p>
      </footer>
    </div>
  );
}
