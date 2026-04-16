import { z } from "zod";

export const contactFormSchema = z.object({
  nome: z.string().min(2, "Informe seu nome."),
  email: z.string().email("Informe um e-mail válido."),
  assunto: z.string().min(3, "Informe o assunto."),
  mensagem: z.string().min(10, "A mensagem deve ter pelo menos 10 caracteres."),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
