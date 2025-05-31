import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TodoItemsModule } from '../src/todo_items/todo_items.module';
import { TodoListsModule } from '../src/todo_lists/todo_lists.module';

// Agregar un item a una lista
// Eliminar un item especifico de una list
// obtener un item especifico de una list
// obtener todos los items relacionados de una lista
// actualizar un item especifico de una list

describe('TodoItemsController (e2e)', () => {
  let app: INestApplication;
  let listId: number;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TodoItemsModule, TodoListsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Creates a todo list', async () => {
    const listRes = await request(app.getHttpServer())
      .post('/api/todolists')
      .send({ name: 'Test List' });
    listId = listRes.body.id;
  });

  it('Creates a todo item', async () => {
    const itemName = 'Test item 1 for list ' + listId;
    const itemDescription = 'Testing...';
    const res = await request(app.getHttpServer())
      .post(`/api/todoitems/list/${listId}`)
      .send({
        title: itemName,
        description: itemDescription,
        completed: false,
      })
      .expect(201);
    const itemsList = res.body;
    expect(Array.isArray(itemsList)).toBe(true);
    expect(itemsList[itemsList.length - 1]).toEqual({
      id: 1,
      listId: listId,
      title: itemName,
      description: itemDescription,
      completed: false,
    });
  });

  it('Returns all items in list', async () => {
    const itemName = 'Another item';
    const itemDescription = 'Another desc';
    const firstRes = await request(app.getHttpServer())
      .post(`/api/todoitems/list/${listId}`)
      .send({
        title: itemName,
        description: itemDescription,
        completed: true,
      });
    const completeList = firstRes.body;

    const res = await request(app.getHttpServer())
      .get(`/api/todoitems/list/${listId}`)
      .expect(200);

    const itemsList = res.body;

    expect(itemsList).toEqual(completeList);
  });

  it('Updates the item', async () => {
    const itemName = 'New item for list ' + listId;
    const itemDescription = 'New desc';
    const created = await request(app.getHttpServer())
      .post(`/api/todoitems/list/${listId}`)
      .send({
        title: itemName,
        description: itemDescription,
        completed: false,
      });

    const itemsList = created.body;
    const lastCreatedItem = itemsList[itemsList.length - 1];
    expect(lastCreatedItem.title).toEqual(itemName);
    expect(lastCreatedItem.description).toEqual(itemDescription);
    expect(lastCreatedItem.completed).toEqual(false);
    const id = lastCreatedItem.id;

    const newItemName = 'Edited';
    const newItemDescription = 'Updated desc';
    const updated = await request(app.getHttpServer())
      .put(`/api/todoitems/list/${listId}/item/${id}`)
      .send({
        title: newItemName,
        description: newItemDescription,
        completed: true,
      })
      .expect(200);

    expect(updated.body.title).toBe(newItemName);
    expect(updated.body.description).toBe(newItemDescription);
    expect(updated.body.completed).toBe(true);
  });

  it('Get a specific item', async () => {
    const itemName = 'New item for list ' + listId;
    const itemDescription = 'New desc';
    const created = await request(app.getHttpServer())
      .post(`/api/todoitems/list/${listId}`)
      .send({
        title: itemName,
        description: itemDescription,
        completed: false,
      });
    const itemsList = created.body;
    const lastCreatedItem = itemsList[itemsList.length - 1];

    const res = await request(app.getHttpServer())
      .get(`/api/todoitems/list/${listId}/item/${lastCreatedItem.id}`)
      .expect(200);

    expect(res.body.title).toBe(itemName);
    expect(res.body.description).toBe(itemDescription);
    expect(res.body.completed).toBe(false);
  });

  it('Deletes item', async () => {
    const itemName = 'To delete';
    const itemDescription = 'Item to be deleted';
    const created = await request(app.getHttpServer())
      .post(`/api/todoitems/list/${listId}`)
      .send({
        title: itemName,
        description: itemDescription,
        completed: false,
      });
    const itemsList = created.body;
    const lastCreatedItem = itemsList[itemsList.length - 1];

    await request(app.getHttpServer())
      .delete(`/api/todoitems/list/${listId}/item/${lastCreatedItem.id}`)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/api/todoitems/list/${listId}/item/${lastCreatedItem.id}`)
      .expect(404);

    const result = await request(app.getHttpServer())
      .get(`/api/todoitems/list/${listId}`)
      .expect(200);

    expect(result.body).toEqual([]);
  });
});
