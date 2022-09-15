import { faker } from "@faker-js/faker";
import { prisma } from "../../src/database";

type TItemData = {
  title: string;
  url: string;
  description: string;
  amount: number;
};

export function fakeItem() {
  return {
    title: faker.commerce.productName(),
    url: faker.internet.url(),
    description: faker.commerce.productDescription(),
    amount: faker.datatype.number(100),
  };
}

export async function createItem(item: TItemData) {
  return await prisma.items.create({ data: item });
}

export async function createManyItems() {
  const length = faker.datatype.number(10);
  for (let i = 0; i < length; i++) {
    const item = fakeItem();
    await createItem(item);
  }
  return null;
}
