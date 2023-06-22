import { Either, left, right } from "@/core/either";
import { Answer } from "../../enterprise/entities/answer";
import { AnswersRepository } from "../repositories/answers-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface FetchQuestionsAnswersUseCaseRequest {
  questionId: string;
  page: number;
}

type FetchQuestionsAnswersUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    answers: Answer[];
  }
>;

// Com as interfaces das entities, fica melhor o retorno como objeto, pois sabemos exatamente a ordem e como deve ser passado
export class FetchQuestionsAnswersUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionsAnswersUseCaseRequest): Promise<FetchQuestionsAnswersUseCaseResponse> {
    const answers = await this.answersRepository.findManyByQuestionId(
      questionId,
      { page }
    );

    if (!answers) {
      return left(new ResourceNotFoundError());
    }

    return right({
      answers,
    });
  }
}
