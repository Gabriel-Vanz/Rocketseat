import { InMemoryQuestionCommentsRepository } from "tests/repositories/in-memory-question-comments-repository";
import { DeleteQuestionCommentUseCase } from "./delete-question-comment";
import { makeQuestionComment } from "tests/factories/make-question-comment";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

// sut -> System Under Test
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: DeleteQuestionCommentUseCase;

describe("Delete Question Comment", () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository();
    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository);
  });

  it("should be able to delete a question comment", async () => {
    const questionComment = makeQuestionComment();

    await inMemoryQuestionCommentsRepository.create(questionComment);

    await sut.execute({
      questionCommentId: questionComment.id.toString(),
      authorId: questionComment.authorId.toString(),
    });

    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0);
  });

  it("should not be able to delete another user question comment", async () => {
    const questionComment = makeQuestionComment({
      authorId: new UniqueEntityID("user-id"),
    });

    await inMemoryQuestionCommentsRepository.create(questionComment);

    expect(() => {
      return sut.execute({
        questionCommentId: questionComment.id.toString(),
        authorId: "another-user-id",
      });
    }).rejects.toBeInstanceOf(Error);
  });
});
