import type { Metadata } from "next";
import styles from "./page.module.scss";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contato | Receitas do Marcelo",
  description:
    "Entre em contato com o Marcelo. Sugestões, dúvidas ou recadinhos são bem-vindos.",
};

export default function ContatoPage() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header className={styles.header}>
          <h1>Fale comigo</h1>
          <p>
            Tem uma sugestão de receita, uma dúvida ou só quer mandar um alô?
            <br />
            Preencha o formulário abaixo e responderei assim que possível.
          </p>
        </header>

        <div className={styles.layout}>
          <div className={styles.formCard}>
            <ContactForm />
          </div>

          <aside className={styles.aside}>
            <div className={styles.infoCard}>
              <h3>Informações</h3>

              <div className={styles.infoItem}>
                <span className={styles.infoIcon}>📍</span>
                <div className={styles.infoText}>
                  <span className={styles.infoLabel}>Localização</span>
                  <span className={styles.infoValue}>Brasil</span>
                </div>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.infoIcon}>⏰</span>
                <div className={styles.infoText}>
                  <span className={styles.infoLabel}>Tempo de resposta</span>
                  <span className={styles.infoValue}>
                    Normalmente em até 48 horas
                  </span>
                </div>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.infoIcon}>💬</span>
                <div className={styles.infoText}>
                  <span className={styles.infoLabel}>Assuntos</span>
                  <span className={styles.infoValue}>
                    Sugestões de receitas, erros no site, parcerias e muito mais
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
