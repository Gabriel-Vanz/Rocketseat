import { makeAnswer } from "tests/factories/make-answer";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { InMemoryAnswerCommentsRepository } from "tests/repositories/in-memory-answer-comments-repository";
import { FetchAnswerCommentsUseCase } from "./fetch-answer-comments";
import { makeAnswerComment } from "tests/factories/make-answer-comment";

// sut -> System Under Test
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: FetchAnswerCommentsUseCase;

describe("Fetch Answer Comments", () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository);
  });

  it("should be able to fetch answer comments", async () => {
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID("answerId-1"),
      })
    );
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID("answerId-1"),
      })
    );
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID("answerId-1"),
      })
    );

    const result = await sut.execute({
      answerId: "answerId-1",
      page: 1,
    });

    expect(result.value?.answerComments).toHaveLength(3);
  });

  it("should be able to fetch paginated answer answers", async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityID("answerId-1"),
        })
      );
    }

    const result = await sut.execute({
      answerId: "answerId-1",
      page: 2,
    });

    expect(result.value?.answerComments).toHaveLength(2);
  });
});
