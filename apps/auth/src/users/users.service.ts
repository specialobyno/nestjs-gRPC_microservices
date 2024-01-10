import {
  User,
  CreateUserDto,
  Users,
  UpdateUserDto,
  PaginationDto,
} from '@app/common';
import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly users: User[] = [];
  onModuleInit() {
    for (let i = 0; i < 100; i++)
      this.createUser({
        username: randomUUID(),
        password: randomUUID(),
        age: 0,
      });
  }
  createUser(createUserDto: CreateUserDto): User {
    const user: User = {
      id: randomUUID(),
      ...createUserDto,
      subscribed: false,
      socialMedia: {},
    };
    this.users.push(user);
    return user;
  }

  findAllUsers(): Users {
    return { users: this.users };
  }

  findOneUser(id: string): User {
    return this.users.find((user) => user.id === id);
  }

  updateUser(id: string, updateUserDto: UpdateUserDto): User {
    const userIndex: number = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1)
      throw new NotFoundException(`User with id ${id} does not exist`);
    const user: User = this.users[userIndex];
    this.users[userIndex] = { ...user, ...updateUserDto };
    return this.users[userIndex];
  }

  removeUser(id: string): User {
    const userIndex: number = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1)
      throw new NotFoundException(`User with id ${id} does not exist`);
    return this.users.splice(userIndex, 1)[0];
  }

  queryUsers(
    PaginationDtoStream: Observable<PaginationDto>,
  ): Observable<Users> {
    const subject = new Subject<Users>();
    const onNext = (PaginationDtoStream: PaginationDto) => {
      const { page, skip } = PaginationDtoStream;
      const start = page * skip;
      const end = start + skip;
      const users = this.users.slice(start, end);
      subject.next({ users });
    };
    const onComplete = () => subject.complete();
    PaginationDtoStream.subscribe({ next: onNext, complete: onComplete });
    return subject.asObservable();
  }
}
