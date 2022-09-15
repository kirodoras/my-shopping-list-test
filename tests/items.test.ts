import app from "../src/app";
import supertest from "supertest";
import { prisma } from "../src/database";
import * as itemsFatory from "./factories/items.factory";
import { clear } from "console";

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE items;`;
});

describe("Testa POST /items ", () => {
  it("Deve retornar 201, se cadastrado um item no formato correto", async () => {
    const item = itemsFatory.fakeItem();

    const response = await supertest(app).post("/items").send(item);

    expect(response.status).toEqual(201);
    delete response.body.id;
    expect(response.body).toEqual(item);
  });
  it("Deve retornar 409, ao tentar cadastrar um item que exista", async () => {
    const item = itemsFatory.fakeItem();
    await itemsFatory.createItem(item);

    const response = await supertest(app).post("/items").send(item);
    expect(response.status).toEqual(409);
  });
});

describe("Testa GET /items ", () => {
  it("Deve retornar status 200 e o body no formato de Array", async () => {
    itemsFatory.createManyItems();
    const response = await supertest(app).get("/items");

    expect(response.status).toEqual(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });
});

describe("Testa GET /items/:id ", () => {
  let itemId: number = 1;
  it("Deve retornar status 200 e um objeto igual a o item cadastrado", async () => {
    const item = itemsFatory.fakeItem();
    const createdItem = await itemsFatory.createItem(item);

    const response = await supertest(app).get(`/items/${createdItem.id}`);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual(createdItem);
    itemId = response.body.id;
  });
  it("Deve retornar status 404 caso não exista um item com esse id", async () => {
    const response = await supertest(app).get(`/items/${itemId}`);
    expect(response.status).toEqual(404);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
