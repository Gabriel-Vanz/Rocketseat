import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachment";

export class InMemoryAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  public items: AnswerAttachment[] = [];

  async findById(id: string) {
    const answerAttachment = this.items.find(
      (item) => item.id.toString() === id
    );

    if (!answerAttachment) {
      return null;
    }

    return answerAttachment;
  }

  async findManyByAnswerId(answerId: string) {
    const answerAttachment = this.items.filter(
      (item) => item.answerId.toString() == answerId
    );

    return answerAttachment;
  }

  async deleteManyByAnswerId(answerId: string) {
    const answerAttachment = this.items.filter(
      (item) => item.answerId.toString() != answerId
    );

    this.items = answerAttachment;
  }
}
