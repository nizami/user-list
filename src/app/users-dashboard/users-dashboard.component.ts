import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  ListRequest,
  UserDto,
  UserListResponseDto,
  UsersApiService,
} from '../services/users.api.service';
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  finalize,
  takeUntil,
} from 'rxjs';
import { CommonModule } from '@angular/common';
import { SearchUsersFormModel } from './model/search-users-form.model';
import { ViewState } from './model/view-state.model';
import { UsersListViewComponent } from './users-list-view/users-list-view.component';
import { UsersCardsViewComponent } from './users-cards-view/users-cards-view.component';

const DEFAULT_PAGE_NUMBER = 1;
const ITEMS_PER_PAGE = [5, 10, 20] as const;

@Component({
  selector: 'app-users-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UsersListViewComponent,
    UsersCardsViewComponent,
  ],
  templateUrl: './users-dashboard.component.html',
  styleUrl: './users-dashboard.component.scss',
})
export class UsersDashboardComponent implements OnInit, OnDestroy {
  protected ViewState = ViewState;
  protected currentViewState = ViewState.Cards;

  protected searchForm = new FormGroup<SearchUsersFormModel>({
    search: new FormControl(),
    pageNumber: new FormControl(DEFAULT_PAGE_NUMBER, {
      nonNullable: true,
    }),
    itemsPerPage: new FormControl<ListRequest['itemsPerPage']>(
      ITEMS_PER_PAGE[0],
      {
        nonNullable: true,
      }
    ),
  });

  protected allItemsPerPage = ITEMS_PER_PAGE;

  protected get currentItemsPerPage() {
    return this.searchForm.getRawValue().itemsPerPage;
  }

  protected get allPageNumbers(): number[] {
    if (this.response) {
      const length = Math.ceil(
        this.response.total_count / this.currentItemsPerPage
      );

      return Array.from({ length }, (x, i) => i + 1);
    }

    return [];
  }

  protected get currentPageNumber() {
    return this.searchForm.getRawValue().pageNumber;
  }

  protected loading = false;
  protected response?: UserListResponseDto;

  private destroy$ = new Subject<void>();

  constructor(private usersApi: UsersApiService) {}

  public ngOnInit(): void {
    this.updateSearchedUsers();

    this.searchForm.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateSearchedUsers();
      });
  }

  public ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected setViewState(value: ViewState): void {
    this.currentViewState = value;
  }

  protected setItemsPerPage(value: ListRequest['itemsPerPage']): void {
    this.searchForm.controls.itemsPerPage.setValue(value);
  }

  protected setPageNumber(value: number): void {
    this.searchForm.controls.pageNumber.setValue(value);
  }

  protected onRemove(user: UserDto): void {
    this.loading = true;

    this.usersApi
      .remove(user.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateSearchedUsers();
      });
  }

  private updateSearchedUsers() {
    this.loading = true;
    const request = this.searchForm.getRawValue();

    this.usersApi
      .getList(request)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.loading = false))
      )
      .subscribe((response) => {
        this.response = response;

        this.searchForm.controls.pageNumber.setValue(response.page_number, {
          emitEvent: false,
        });
      });
  }
}
