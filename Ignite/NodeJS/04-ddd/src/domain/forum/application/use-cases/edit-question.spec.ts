import { InMemoryQuestionsRepository } from "tests/repositories/in-memory-questions-repository";
import { makeQuestion } from "tests/factories/make-question";
import { Slug } from "../../enterprise/entities/value-objects/slug";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { EditQuestionUseCase } from "./edit-question";
import { NotAllowedError } from "./errors/not-allowed-error";

// sut -> System Under Test
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: EditQuestionUseCase;

describe("Edit a question", () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
    sut = new EditQuestionUseCase(inMemoryQuestionsRepository);
  });

  it("should be able to edit a question", async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID("123"),
      },
      new UniqueEntityID("question-1")
    );

    await inMemoryQuestionsRepository.create(newQuestion);

    await sut.execute({
      authorId: "123",
      title: "New Title",
      content: "New Content",
      questionId: newQuestion.id.toValue(),
    });

    expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
      title: "New Title",
      content: "New Content",
    });
  });

  it("should not be able to edit a question from another user", async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID("123"),
      },
      new UniqueEntityID("question-1")
    );

    await inMemoryQuestionsRepository.create(newQuestion);

    const result = await sut.execute({
      authorId: "1235",
      title: "New Title",
      content: "New Content",
      questionId: newQuestion.id.toValue(),
    });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
