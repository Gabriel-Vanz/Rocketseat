import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

// Colocar todos os campos que não são opcionais e colocar em uma interface
export interface CommentProps {
  authorId: UniqueEntityID;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}

export abstract class Comment<
  Props extends CommentProps
> extends Entity<Props> {
  // para o arquivo que está fora do contexto da entity, precisamos criar getters para acessar, como exemplo o arquivo de teste, para acessar o content.
  get authorId() {
    return this.props.authorId;
  }

  get content() {
    return this.props.content;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  set content(content: string) {
    this.props.content = content;
    this.touch();
  }
}
