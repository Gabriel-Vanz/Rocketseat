import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface InstructorProps {
  name: string
}

export class Instructor extends Entity<InstructorProps> {
  // Como já temos o construtor exatamente igual ao da classe pai, não precisamos reescrever ele
  /* constructor(props: AnswerProps, id?: string) {
        super(props, id)
    }
    */

  get name() {
    return this.props.name
  }

  static create(props: InstructorProps, id?: UniqueEntityID) {
    const instructor = new Instructor(
      {
        ...props,
      },
      id,
    )

    return instructor
  }
}
