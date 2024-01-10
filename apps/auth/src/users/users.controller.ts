import { Controller } from '@nestjs/common';

import { UsersService } from './users.service';
import {
  CreateUserDto,
  FindOneUserDto,
  PaginationDto,
  UpdateUserDto,
  User,
  Users,
  UsersServiceController,
  UsersServiceControllerMethods,
} from '@app/common';
import { Observable } from 'rxjs';

@Controller()
@UsersServiceControllerMethods()
export class UsersController implements UsersServiceController {
  constructor(private readonly usersService: UsersService) {}

  createUser(
    createUserDto: CreateUserDto,
  ): Promise<User> | Observable<User> | User {
    return this.usersService.createUser(createUserDto);
  }

  findAllUsers(): Promise<Users> | Observable<Users> | Users {
    return this.usersService.findAllUsers();
  }

  findOneUser(
    findOneUserDto: FindOneUserDto,
  ): Promise<User> | Observable<User> | User {
    return this.usersService.findOneUser(findOneUserDto.id);
  }

  updateUser(
    updateUserDto: UpdateUserDto,
  ): Promise<User> | Observable<User> | User {
    return this.usersService.updateUser(updateUserDto.id, updateUserDto);
  }

  removeUser(
    findOneUserDto: FindOneUserDto,
  ): Promise<User> | Observable<User> | User {
    return this.usersService.removeUser(findOneUserDto.id);
  }

  queryUsers(
    PaginationDtoStream: Observable<PaginationDto>,
  ): Observable<Users> {
    return this.usersService.queryUsers(PaginationDtoStream);
  }
}
