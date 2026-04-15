import type { FormEvent } from "react";
import LoadingButton from "../UI/LoadingButton";
import styles from "./AdminAuthCard.module.scss";

type AdminAuthCardProps = {
  username: string;
  password: string;
  isLoggingIn: boolean;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function AdminAuthCard({
  username,
  password,
  isLoggingIn,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
}: AdminAuthCardProps) {
  return (
    <main className={styles.authCard}>
      <h1>Admin</h1>
      <p>Digite a senha para acessar o painel de receitas.</p>
      <form onSubmit={onSubmit} className={styles.authForm}>
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(event) => onUsernameChange(event.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(event) => onPasswordChange(event.target.value)}
        />
        <LoadingButton
          type="submit"
          isLoading={isLoggingIn}
          loadingText="Entrando..."
        >
          Entrar
        </LoadingButton>
      </form>
    </main>
  );
}
