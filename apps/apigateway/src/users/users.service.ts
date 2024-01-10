import {
  CreateUserDto,
  PaginationDto,
  USERS_SERVICE_NAME,
  UpdateUserDto,
  UsersServiceClient,
} from '@app/common';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { AUTH_SERVICE } from './constants';
import { ClientGrpc } from '@nestjs/microservices';
import { ReplaySubject } from 'rxjs';

@Injectable()
export class UsersService implements OnModuleInit {
  private usersService: UsersServiceClient;
  constructor(@Inject(AUTH_SERVICE) private client: ClientGrpc) {}
  onModuleInit() {
    this.usersService =
      this.client.getService<UsersServiceClient>(USERS_SERVICE_NAME);
  }
  createUser(createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  findAllUsers() {
    return this.usersService.findAllUsers({});
  }

  findOneUser(id: string) {
    return this.usersService.findOneUser({ id });
  }

  updateUser(id: string, updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser({ id, ...updateUserDto });
  }

  removeUser(id: string) {
    return this.usersService.removeUser({ id });
  }

  queryUsers() {
    const users$ = new ReplaySubject<PaginationDto>();
    const total = 100;
    const skip = 25;
    let page = 0;

    while (total > page * skip) {
      users$.next({ page, skip });
      page++;
    }
    users$.complete();
    let chunkNumber = 1;
    return this.usersService.queryUsers(users$).subscribe((users) => {
      console.log('Chunk', chunkNumber, users);

      chunkNumber++;
    });
  }
}
