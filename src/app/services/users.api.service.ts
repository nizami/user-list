import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

const DELAY_VALUE = 1000; // ms

@Injectable({
  providedIn: 'root',
})
export class UsersApiService {
  private DB: UserDto[] = [
    { id: 'u1', user_name: 'Ivan Z.', is_active: true },
    { id: 'u2', user_name: 'Mikhail X.', is_active: true },
    { id: 'u3', user_name: 'Ivan C.', is_active: true },
    { id: 'u4', user_name: 'Petr V.', is_active: true },
    { id: 'u5', user_name: 'Artyom B.', is_active: true },
    { id: 'u6', user_name: 'Gleb N.', is_active: true },
    { id: 'u7', user_name: 'Anton M.', is_active: true },
    { id: 'u8', user_name: 'Semyon A.', is_active: true },
    { id: 'u9', user_name: 'Arseniy S.', is_active: true },
    { id: 'u10', user_name: 'Nick D.', is_active: true },
    { id: 'u11', user_name: 'Alex F.', is_active: true },
    { id: 'u12', user_name: 'Kirill G.', is_active: true },
    { id: 'u13', user_name: 'Stas H.', is_active: true },
    { id: 'u14', user_name: 'Yuriy J.', is_active: true },
    { id: 'u15', user_name: 'Roman K.', is_active: true },
    { id: 'u16', user_name: 'Ivan L.', is_active: true },
    { id: 'u17', user_name: 'Ivan Q.', is_active: true },
  ];

  getList(request: ListRequest): Observable<UserListResponseDto> {
    const search = request.search?.toLowerCase();
    const filteredUsers = this.DB.filter(
      (x) =>
        !search || (x.is_active && x.user_name.toLowerCase().includes(search))
    );

    const pagesCount = Math.ceil(filteredUsers.length / request.itemsPerPage);
    const pageNumber =
      request.pageNumber > pagesCount ? pagesCount : request.pageNumber;

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

  getById(id: string): Observable<UserDto | undefined> {
    const user = this.DB.find((x) => x.id === id && x.is_active);

    return of(user).pipe(delay(DELAY_VALUE));
  }

  remove(id: string): Observable<void> {
    const user = this.DB.find((x) => x.id === id && x.is_active);

    if (user) {
      user.is_active = false;
    }

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
