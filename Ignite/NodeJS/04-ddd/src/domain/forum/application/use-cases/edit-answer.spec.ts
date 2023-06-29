import { InMemoryAnswersRepository } from "tests/repositories/in-memory-answers-repository";
import { makeAnswer } from "tests/factories/make-answer";
import { Slug } from "../../enterprise/entities/value-objects/slug";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { EditAnswerUseCase } from "./edit-answer";
import { NotAllowedError } from "./errors/not-allowed-error";

// sut -> System Under Test
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: EditAnswerUseCase;

describe("Edit a answer", () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository();
    sut = new EditAnswerUseCase(inMemoryAnswersRepository);
  });

  it("should be able to edit a answer", async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID("123"),
      },
      new UniqueEntityID("answer-1")
    );

    await inMemoryAnswersRepository.create(newAnswer);

    await sut.execute({
      authorId: "123",
      content: "New Content",
      answerId: newAnswer.id.toValue(),
    });

    expect(inMemoryAnswersRepository.items[0]).toMatchObject({
      content: "New Content",
    });
  });

  it("should not be able to edit a answer from another user", async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID("123"),
      },
      new UniqueEntityID("answer-1")
    );

    await inMemoryAnswersRepository.create(newAnswer);

    const result = await sut.execute({
      authorId: "1235",
      content: "New Content",
      answerId: newAnswer.id.toValue(),
    });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
