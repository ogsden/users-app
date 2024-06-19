import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { UsersApi, UserDto } from '../../services/users-api.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { UserCardComponent } from '../user-card/user-card.component';
import { UserRowComponent } from '../user-row/user-row.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UserCardComponent, UserRowComponent],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  public users: UserDto[] = [];
  public loading = false;
  public viewMode: 'card' | 'list' = 'card';
  public pages: number[] = [];
  public searchControl = new FormControl<string | null>('');
  private totalUsers = 0;
  private currentPage = 1;
  private itemsPerPage: 5 | 10 | 20 = 5;

  constructor(private usersApi: UsersApi) {}

  public ngOnInit(): void {
    this.loadUsers();

    this.searchControl.valueChanges.pipe(
      debounceTime(500),
      switchMap(searchTerm => {
        this.currentPage = 1;
        return this.usersApi.getList({
          pageNumber: this.currentPage,
          search: searchTerm ?? undefined,
          itemsPerPage: this.itemsPerPage
        });
      })
    ).subscribe(response => {
      this.users = response.items;
      this.totalUsers = response.total_count;
      this.updatePages();
    });
  }

  private loadUsers(): void {
    this.loading = true;
    this.usersApi.getList({
      pageNumber: this.currentPage,
      search: this.searchControl.value ?? undefined,
      itemsPerPage: this.itemsPerPage
    }).subscribe(response => {
      this.users = response.items;
      this.totalUsers = response.total_count;
      this.loading = false;
      this.updatePages();
    });
  }

  public onPageChange(page: number): void {
    this.currentPage = page;
    this.loadUsers();
  }

  public onItemsPerPageChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    if (value) {
      this.itemsPerPage = parseInt(value, 10) as 5 | 10 | 20;
      this.currentPage = 1;
      this.loadUsers();
    }
  }

  public removeUser(id: string): void {
    this.usersApi.remove(id).subscribe(() => {
      this.loadUsers();
    });
  }

  public toggleViewMode(): void {
    this.viewMode = this.viewMode === 'card' ? 'list' : 'card';
  }

  private updatePages(): void {
    const totalPages = Math.ceil(this.totalUsers / this.itemsPerPage);
    this.pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  }
}