import Image from "next/image";
import Link from "next/link";
import styles from "./not-found.module.scss";

export const metadata = {
  title: "Página não encontrada | Receitas do Marcelo",
};

const illustrationPlaceholder =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="280" height="240" viewBox="0 0 280 240" fill="none">
      <rect width="280" height="240" rx="24" fill="#FFF7ED"/>
      <circle cx="140" cy="92" r="52" fill="#FED7AA"/>
      <path d="M98 150C98 126.804 116.804 108 140 108C163.196 108 182 126.804 182 150V156H98V150Z" fill="#C2410C"/>
      <rect x="84" y="156" width="112" height="18" rx="9" fill="#9A3412"/>
      <rect x="188" y="118" width="12" height="48" rx="6" fill="#7C2D12"/>
      <text x="140" y="210" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#7C2D12">404</text>
    </svg>
  `);

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.illustration}>
          <Image
            src={illustrationPlaceholder}
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
          você chegar.
        </p>
        <Link href="/" className={styles.button}>
          Voltar para a cozinha
        </Link>
      </div>
    </div>
  );
}
