import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

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
  total_count: number;
  items: UserDto[];
}

@Injectable({ providedIn: 'root' })
export class UsersApi {
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

  public getList(request: ListRequest): Observable<UserListResponseDto> {
    const { pageNumber, search, itemsPerPage } = request;
    let filteredDB = this.DB;

    if (search) {
      filteredDB = filteredDB.filter(user => user.user_name.toLowerCase().includes(search.toLowerCase()));
    }

    const start = (pageNumber - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const items = filteredDB.slice(start, end);

    return of({ total_count: filteredDB.length, items }).pipe(delay(500));
  }

  public getById(id: string): Observable<UserDto> {
    const user = this.DB.find(user => user.id === id);
    return of(user).pipe(
      delay(500),
      map(u => {
        if (!u) {
          throw new Error('User not found');
        }
        return u;
      })
    );
  }

  public remove(id: string): Observable<void> {
    this.DB = this.DB.filter(user => user.id !== id);
    return of(undefined).pipe(delay(500));
  }
}
