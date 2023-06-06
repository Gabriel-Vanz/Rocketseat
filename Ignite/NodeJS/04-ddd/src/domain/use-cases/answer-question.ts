import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Answer } from "../entities/answer";
import { AnswersRepository } from "../repositories/answers-repository";

interface AnswerQuestionUseCaseRequest {
  instructorId: string;
  questionId: string;
  content: string;
}

//Com as interfaces das entities, fica melhor o retorno como objeto, pois sabemos exatamente a ordem e como deve ser passado
export class AnswerQuestionUseCase {
  constructor(private answerRepository: AnswersRepository) {}

  async execute({
    instructorId,
    questionId,
    content,
  }: AnswerQuestionUseCaseRequest) {
    const answer = Answer.create({
      content,
      authorId: new UniqueEntityID(instructorId),
      questionId: new UniqueEntityID(questionId),
    });

    await this.answerRepository.create(answer);
    return answer;
  }
}
