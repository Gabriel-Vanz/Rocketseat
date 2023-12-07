import { InMemoryAnswersRepository } from "tests/repositories/in-memory-answers-repository";
import { makeAnswer } from "tests/factories/make-answer";
import { Slug } from "../../enterprise/entities/value-objects/slug";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { EditAnswerUseCase } from "./edit-answer";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { InMemoryAnswerAttachmentsRepository } from "tests/repositories/in-memory-answer-attachments-repository";
import { makeAnswerAttachment } from "tests/factories/make-answer-attachment";

// sut -> System Under Test
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: EditAnswerUseCase;

describe("Edit a answer", () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();

    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository
    );
    sut = new EditAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerAttachmentsRepository
    );
  });

  it("should be able to edit a answer", async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID("123"),
      },
      new UniqueEntityID("answer-1")
    );

    await inMemoryAnswersRepository.create(newAnswer);

    inMemoryAnswerAttachmentsRepository.items.push(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID("attachment-1"),
      }),
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID("attachment-2"),
      })
    );

    await sut.execute({
      authorId: "123",
      content: "New Content",
      answerId: newAnswer.id.toValue(),
      attachmentsIds: ["attachment-1", "attachment-3"],
    });

    expect(inMemoryAnswersRepository.items[0]).toMatchObject({
      content: "New Content",
    });
    expect(
      inMemoryAnswersRepository.items[0].attachments.currentItems
    ).toHaveLength(2);
    expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toEqual(
      [
        expect.objectContaining({
          attachmentId: new UniqueEntityID("attachment-1"),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityID("attachment-3"),
        }),
      ]
    );
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
      attachmentsIds: ["attachment-1", "attachment-3"],
    });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
