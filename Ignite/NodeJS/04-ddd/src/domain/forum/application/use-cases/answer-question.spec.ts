import { InMemoryAnswersRepository } from "tests/repositories/in-memory-answers-repository";
import { AnswerQuestionUseCase } from "./answer-question";

// sut -> System Under Test
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: AnswerQuestionUseCase;

describe("Create Answer", () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository();
    sut = new AnswerQuestionUseCase(inMemoryAnswersRepository);
  });

  it("should be able to create an answer", async () => {
    const { answer } = await sut.execute({
      questionId: "123",
      instructorId: "1",
      content: "Conteúdo de resposta",
    });

    expect(answer.id).toBeTruthy();
    expect(inMemoryAnswersRepository.items[0].id).toEqual(answer.id);
  });
});
