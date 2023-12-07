import { InMemoryQuestionsRepository } from "tests/repositories/in-memory-questions-repository";
import { makeQuestion } from "tests/factories/make-question";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { EditQuestionUseCase } from "./edit-question";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { InMemoryQuestionAttachmentRepository } from "tests/repositories/in-memory-question-attachments-repository";
import { makeQuestionAttachment } from "tests/factories/make-question-attachment";

// sut -> System Under Test
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let sut: EditQuestionUseCase;

describe("Edit a question", () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentRepository
    );
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository();

    sut = new EditQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionAttachmentRepository
    );
  });

  it("should be able to edit a question", async () => {
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
      authorId: "123",
      title: "New Title",
      content: "New Content",
      questionId: newQuestion.id.toValue(),
      attachmentsIds: ["attachment-1", "attachment-3"],
    });

    expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
      title: "New Title",
      content: "New Content",
    });
    expect(
      inMemoryQuestionsRepository.items[0].attachments.currentItems
    ).toHaveLength(2);
    expect(
      inMemoryQuestionsRepository.items[0].attachments.currentItems
    ).toEqual([
      expect.objectContaining({
        attachmentId: new UniqueEntityID("attachment-1"),
      }),
      expect.objectContaining({
        attachmentId: new UniqueEntityID("attachment-3"),
      }),
    ]);
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
      attachmentsIds: [],
    });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
