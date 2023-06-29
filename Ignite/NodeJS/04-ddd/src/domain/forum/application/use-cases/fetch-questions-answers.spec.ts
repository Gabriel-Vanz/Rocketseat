import { InMemoryAnswersRepository } from "tests/repositories/in-memory-answers-repository";
import { FetchQuestionsAnswersUseCase } from "./fetch-questions-answers";
import { makeAnswer } from "tests/factories/make-answer";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

// sut -> System Under Test
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: FetchQuestionsAnswersUseCase;

describe("Fetch Questions Answers", () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository();
    sut = new FetchQuestionsAnswersUseCase(inMemoryAnswersRepository);
  });

  it("should be able to fetch question answers", async () => {
    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: new UniqueEntityID("questionId-1"),
      })
    );
    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: new UniqueEntityID("questionId-1"),
      })
    );
    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: new UniqueEntityID("questionId-1"),
      })
    );

    const result = await sut.execute({
      questionId: "questionId-1",
      page: 1,
    });

    expect(result.value?.answers).toHaveLength(3);
  });

  it("should be able to fetch paginated question answers", async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswersRepository.create(
        makeAnswer({
          questionId: new UniqueEntityID("questionId-1"),
        })
      );
    }

    const result = await sut.execute({
      questionId: "questionId-1",
      page: 2,
    });

    expect(result.value?.answers).toHaveLength(2);
  });
});
