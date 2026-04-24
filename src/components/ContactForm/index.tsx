"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import emailjs from "@emailjs/browser";
import {
  contactFormSchema,
  type ContactFormValues,
} from "@/schemas/contact.schema";
import Button from "../UI/Button";
import styles from "./ContactForm.module.scss";

const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

export default function ContactForm() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  async function onSubmit(data: ContactFormValues) {
    setStatus("loading");
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: data.nome,
          from_email: data.email,
          subject: data.assunto,
          message: data.mensagem,
        },
        EMAILJS_PUBLIC_KEY,
      );
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className={styles.successBanner} role="alert">
        ✓ Mensagem enviada! Responderei em breve.
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      {status === "error" && (
        <div className={styles.errorBanner} role="alert">
          Erro ao enviar. Tente novamente.
        </div>
      )}

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="nome">Nome</label>
          <input
            id="nome"
            type="text"
            placeholder="Seu nome completo"
            aria-invalid={!!errors.nome}
            {...register("nome")}
          />
          {errors.nome && (
            <span className={styles.errorText} role="alert">
              {errors.nome.message}
            </span>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            placeholder="seu@email.com"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email && (
            <span className={styles.errorText} role="alert">
              {errors.email.message}
            </span>
          )}
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="assunto">Assunto</label>
        <input
          id="assunto"
          type="text"
          placeholder="Sobre o que você quer falar?"
          aria-invalid={!!errors.assunto}
          {...register("assunto")}
        />
        {errors.assunto && (
          <span className={styles.errorText} role="alert">
            {errors.assunto.message}
          </span>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="mensagem">Mensagem</label>
        <textarea
          id="mensagem"
          placeholder="Escreva sua mensagem aqui..."
          aria-invalid={!!errors.mensagem}
          {...register("mensagem")}
        />
        {errors.mensagem && (
          <span className={styles.errorText} role="alert">
            {errors.mensagem.message}
          </span>
        )}
      </div>

      <div className={styles.actions}>
        <Button
          type="submit"
          size="lg"
          isLoading={status === "loading"}
          loadingText="Enviando..."
        >
          Enviar mensagem
        </Button>
      </div>
    </form>
  );
}
