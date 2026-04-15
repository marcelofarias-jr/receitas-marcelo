import Image from "next/image";
import Link from "next/link";
import styles from "./not-found.module.scss";

export const metadata = {
  title: "Página não encontrada | Receitas do Marcelo",
};

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.illustration}>
          <Image
            src="/404-illustration.png"
            alt="Panela vazia com colher de pau"
            width={280}
            height={240}
            priority
          />
        </div>

        <p className={styles.code}>404</p>
        <h1 className={styles.title}>Página não encontrada</h1>
        <p className={styles.description}>
          Essa receita sumiu da cozinha. Talvez tenha sido devorada antes de
          você chegar, ou talvez nunca tenha existido. De qualquer forma, não se
          preocupe, temos muitas outras receitas deliciosas para você explorar!
        </p>
        <Link href="/" className={styles.button}>
          Voltar para a cozinha
        </Link>
      </div>
    </div>
  );
}
