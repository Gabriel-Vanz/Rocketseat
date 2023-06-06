import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

//Colocar todos os campos que não são opcionais e colocar em uma interface
interface AnswerProps {
  content: string;
  authorId: UniqueEntityID;
  questionId: UniqueEntityID;
  createdAt: Date;
  updatedAt?: Date;
}

export class Answer extends Entity<AnswerProps> {
  //para o arquivo que está fora do contexto da entity, precisamos criar getters para acessar, como exemplo o arquivo de teste, para acessar o content.
  get content() {
    return this.props.content;
  }

  get authorId() {
    return this.props.authorId;
  }

  get questionId() {
    return this.props.questionId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get excerpt() {
    return this.props.content.substring(0, 100).trimEnd().concat("...");
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  set content(content: string) {
    this.props.content = content;
    this.touch();
  }
  //Como já temos o construtor exatamente igual ao da classe pai, não precisamos reescrever ele
  /*constructor(props: AnswerProps, id?: string) {
        super(props, id)
    }
    */
  static create(
    props: Optional<AnswerProps, "createdAt">,
    id?: UniqueEntityID
  ) {
    const answer = new Answer(
      {
        ...props,
        createdAt: new Date(),
      },
      id
    );

    return answer;
  }
}
