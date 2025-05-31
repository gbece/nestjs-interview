import { Injectable, NotFoundException } from '@nestjs/common';
import { TodoItem } from '../interfaces/todo_items.interface';
import { CreateTodoItemDto } from './dtos/create-todo_items';
import { UpdateTodoItemDto } from './dtos/update-todo_items';
import { TodoListsService } from '../todo_lists/todo_lists.service';

@Injectable()
export class TodoItemsService {
  private todoItems: TodoItem[] = [];
  constructor(private readonly todoListsService: TodoListsService) {}

  create(listId: number, dto: CreateTodoItemDto): TodoItem[] {
    const list = this.todoListsService.get(listId);
    if (!list) throw new NotFoundException(`TodoList ${listId} not found`);

    const todoItem: TodoItem = {
      id: this.nextId(listId),
      listId: listId,
      title: dto.title,
      description: dto.description,
      completed: dto.completed,
    };

    this.todoItems.push(todoItem);

    return this.findAllItemsByListId(listId);
  }

  findAllItemsByListId(listId: number): TodoItem[] {
    return this.todoItems.filter((item) => item.listId === listId);
  }

  findOne(listId: number, itemId: number): TodoItem {
    const item = this.todoItems.find(
      (item) => item.listId === listId && item.id === itemId,
    );
    if (!item)
      throw new NotFoundException(
        `TodoItem ${itemId} not found in list ${listId}`,
      );
    return item;
  }

  update(listId: number, itemId: number, dto: UpdateTodoItemDto): TodoItem {
    const item = this.findOne(listId, itemId);
    if (!item) throw new NotFoundException();
    Object.assign(item, dto);
    return item;
  }

  delete(listId: number, itemId: number): void {
    const index = this.todoItems.findIndex(
      (item) => item.listId === listId && item.id === itemId,
    );
    if (index > -1) this.todoItems.splice(index, 1);
  }

  private nextId(listId: number): number {
    const lastId =
      this.todoItems
        .filter((item) => item.listId === listId)
        .map((item) => item.id)
        .sort((a, b) => b - a)[0] ?? 0;
    return lastId + 1;
  }
}
