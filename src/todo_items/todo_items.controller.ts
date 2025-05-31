import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TodoItem } from '../interfaces/todo_items.interface';
import { CreateTodoItemDto } from './dtos/create-todo_items';
import { UpdateTodoItemDto } from './dtos/update-todo_items';
import { TodoItemsService } from './todo_items.service';

@Controller('api/todoitems')
export class TodoItemsController {
  constructor(private readonly todoItemsService: TodoItemsService) {}

  @Get('/list/:todoListId')
  index(@Param('todoListId') listId: number): TodoItem[] {
    return this.todoItemsService.findAllItemsByListId(Number(listId));
  }

  @Get('/list/:todoListId/item/:itemId')
  show(
    @Param('todoListId') listId: number,
    @Param('itemId') itemId: number,
  ): TodoItem {
    return this.todoItemsService.findOne(+listId, +itemId);
  }

  @Post('/list/:todoListId')
  create(
    @Param('todoListId') listId: number,
    @Body() dto: CreateTodoItemDto,
  ): TodoItem[] {
    return this.todoItemsService.create(Number(listId), dto);
  }

  @Put('/list/:todoListId/item/:itemId')
  update(
    @Param('todoListId') listId: number,
    @Param('itemId') itemId: number,
    @Body() dto: UpdateTodoItemDto,
  ): TodoItem {
    return this.todoItemsService.update(Number(listId), Number(itemId), dto);
  }

  @Delete('/list/:todoListId/item/:itemId')
  remove(
    @Param('todoListId') listId: number,
    @Param('itemId') itemId: number,
  ): void {
    return this.todoItemsService.delete(Number(listId), Number(itemId));
  }
}
