import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { StorageService } from './storage.service';

const DELAY_VALUE = 1000; // ms

@Injectable({
  providedIn: 'root',
})
export class UsersApiService {
  constructor(private storage: StorageService) {}

  getList(request: ListRequest): Observable<UserListResponseDto> {
    const search = request.search?.toLowerCase()?.trim();
    const filteredUsers = this.storage
      .getUsers()
      .filter(
        (x) =>
          x.is_active && (!search || x.user_name.toLowerCase().includes(search))
      );

    const pagesCount = Math.ceil(filteredUsers.length / request.itemsPerPage);
    const pageNumber = Math.max(1, Math.min(pagesCount, request.pageNumber));

    const startIndex = (pageNumber - 1) * request.itemsPerPage;
    const endIndex = startIndex + request.itemsPerPage;
    const slicedUsers = filteredUsers.slice(startIndex, endIndex);

    const response: UserListResponseDto = {
      page_number: pageNumber,
      total_count: filteredUsers.length,
      items: slicedUsers,
    };

    return of(response).pipe(delay(DELAY_VALUE));
  }

  // этот метод не использует в контексте задачи
  getById(id: string): Observable<UserDto | undefined> {
    const user = this.storage
      .getUsers()
      .find((x) => x.is_active && x.id === id);

    return of(user).pipe(delay(DELAY_VALUE));
  }

  remove(id: string): Observable<void> {
    const users = this.storage.getUsers();
    const user = users.find((x) => x.is_active && x.id === id);

    if (user) {
      user.is_active = false;
    }

    this.storage.saveUsers(users);

    return of(undefined).pipe(delay(DELAY_VALUE));
  }
}

export interface UserDto {
  id: string;
  user_name: string;
  is_active: boolean;
}

export interface ListRequest {
  pageNumber: number;
  search?: string;
  itemsPerPage: 5 | 10 | 20;
}

export interface UserListResponseDto {
  // я добавил это поле в модель, чтобы не было перерасчета на клиенте, когда номер страницы больше, чем есть в базе
  // можно и без этого параметра, но придется пересчитать на клиенте
  page_number: number;
  total_count: number;
  items: UserDto[];
}
