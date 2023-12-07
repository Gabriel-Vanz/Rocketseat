import { InMemoryQuestionsRepository } from "tests/repositories/in-memory-questions-repository";
import { makeQuestion } from "tests/factories/make-question";
import { Slug } from "../../enterprise/entities/value-objects/slug";
import { DeleteQuestionUseCase } from "./delete-question";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { InMemoryQuestionAttachmentRepository } from "tests/repositories/in-memory-question-attachments-repository";
import { makeQuestionAttachment } from "tests/factories/make-question-attachment";

// sut -> System Under Test
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let sut: DeleteQuestionUseCase;

describe("Delete a question", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentRepository
    );

    sut = new DeleteQuestionUseCase(inMemoryQuestionsRepository);
  });

  it("should be able to delete a question", async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID("123"),
      },
      new UniqueEntityID("question-1")
    );

    await inMemoryQuestionsRepository.create(newQuestion);

    inMemoryQuestionAttachmentRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID("attachment-1"),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID("attachment-2"),
      })
    );

    await sut.execute({
      questionId: "question-1",
      authorId: "123",
    });

    expect(inMemoryQuestionsRepository.items).toHaveLength(0);
    expect(inMemoryQuestionAttachmentRepository.items).toHaveLength(0);
  });

  it("should not be able to delete a question from another user", async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID("123"),
      },
      new UniqueEntityID("question-1")
    );

    await inMemoryQuestionsRepository.create(newQuestion);

    const result = await sut.execute({
      questionId: "question-1",
      authorId: "1234",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
