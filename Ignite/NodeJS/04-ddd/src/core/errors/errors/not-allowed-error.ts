import { UseCaseError } from "@/core/errors/use-cases-error";

// Criação de erros genéricos para serem usados em toda a aplicação
export class NotAllowedError extends Error implements UseCaseError {
  constructor() {
    super("Not Allowed");
  }
}
