import { InMemoryAnswersRepository } from "tests/repositories/in-memory-answers-repository";
import { makeAnswer } from "tests/factories/make-answer";
import { Slug } from "../../enterprise/entities/value-objects/slug";
import { DeleteAnswerUseCase } from "./delete-answer";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "./errors/not-allowed-error";

// sut -> System Under Test
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: DeleteAnswerUseCase;

describe("Delete a answer", () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository();
    sut = new DeleteAnswerUseCase(inMemoryAnswersRepository);
  });

  it("should be able to delete a answer", async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID("123"),
      },
      new UniqueEntityID("answer-1")
    );

    await inMemoryAnswersRepository.create(newAnswer);

    await sut.execute({
      answerId: "answer-1",
      authorId: "123",
    });

    expect(inMemoryAnswersRepository.items).toHaveLength(0);
  });

  it("should not be able to delete a answer from another user", async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID("123"),
      },
      new UniqueEntityID("answer-1")
    );

    await inMemoryAnswersRepository.create(newAnswer);

    const result = await sut.execute({
      answerId: "answer-1",
      authorId: "1234",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
