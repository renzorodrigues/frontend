import { z } from "zod";

export default defineNuxtPlugin(() => {
  z.setErrorMap((issue, ctx) => {
    switch (issue.code) {
      case z.ZodIssueCode.invalid_type:
        if (issue.received === "undefined") {
          return { message: "Este campo é obrigatório" }
        }
        return { message: `Tipo inválido: esperado ${issue.expected}` }

      case z.ZodIssueCode.invalid_string:
        if (issue.validation === "email") {
          return { message: "Digite um e-mail válido" }
        }
        return { message: "Valor inválido" }

      case z.ZodIssueCode.too_small:
        if (issue.type === "string") {
          return { message: `Mínimo de ${issue.minimum} caracteres` }
        }
        return { message: "Valor muito pequeno" }

      case z.ZodIssueCode.too_big:
        if (issue.type === "string") {
          return { message: `Máximo de ${issue.maximum} caracteres` }
        }
        return { message: "Valor muito grande" }

      case z.ZodIssueCode.invalid_date:
        return { message: "Data inválida" }

      case z.ZodIssueCode.custom:
        return { message: issue.message || "Valor inválido" }

      default:
        return { message: ctx.defaultError }
    }
  })
})
