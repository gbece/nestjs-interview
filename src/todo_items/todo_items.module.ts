import { Module } from '@nestjs/common';
import { TodoItemsController } from './todo_items.controller';
import { TodoItemsService } from './todo_items.service';
import { TodoListsModule } from '../todo_lists/todo_lists.module';

@Module({
  imports: [TodoListsModule],
  controllers: [TodoItemsController],
  providers: [TodoItemsService],
  exports: [TodoItemsService],
})
export class TodoItemsModule {}
