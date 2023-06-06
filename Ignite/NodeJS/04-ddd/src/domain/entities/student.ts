import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

interface StudentProps {
  name: string;
}

export class Student extends Entity<StudentProps> {
  //Como já temos o construtor exatamente igual ao da classe pai, não precisamos reescrever ele
  /*constructor(props: AnswerProps, id?: string) {
        super(props, id)
    }
    */

  get name() {
    return this.props.name;
  }

  static create(props: StudentProps, id?: UniqueEntityID) {
    const student = new Student(
      {
        ...props,
      },
      id
    );

    return student;
  }
}
