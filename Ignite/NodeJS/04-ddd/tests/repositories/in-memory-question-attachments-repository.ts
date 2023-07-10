import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";

export class InMemoryQuestionAttachmentRepository
  implements QuestionAttachmentsRepository
{
  public items: QuestionAttachment[] = [];

  async findById(id: string) {
    const questionAttachment = this.items.find(
      (item) => item.id.toString() === id
    );

    if (!questionAttachment) {
      return null;
    }

    return questionAttachment;
  }

  async findManyByQuestionId(questionId: string) {
    const questionAttachment = this.items.filter(
      (item) => item.questionId.toString() == questionId
    );

    return questionAttachment;
  }

  async deleteManyByQuestionId(questionId: string) {
    const questionAttachment = this.items.filter(
      (item) => item.questionId.toString() != questionId
    );

    this.items = questionAttachment;
  }
}
