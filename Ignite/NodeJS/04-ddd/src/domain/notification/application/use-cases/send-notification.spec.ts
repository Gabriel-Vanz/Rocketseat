import { InMemoryNotificationsRepository } from "tests/repositories/in-memory-notifications-repository";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { SendNotificationUseCase } from "./send-notification";

// sut -> System Under Test
let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sut: SendNotificationUseCase;

describe("Send Notification", () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
    sut = new SendNotificationUseCase(inMemoryNotificationsRepository);
  });

  it("should be able to send a notification", async () => {
    const result = await sut.execute({
      recipientId: "123",
      title: "Teste de pergunta",
      content: "Teste de resposta",
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryNotificationsRepository.items[0]).toEqual(
      result.value?.notification
    );
  });
});
