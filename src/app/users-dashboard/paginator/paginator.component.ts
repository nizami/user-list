import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ListRequest } from '../../services/users.api.service';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
})
export class PaginatorComponent {
  @Input() public allItemsPerPage!: ListRequest['itemsPerPage'][];
  @Input() public currentItemsPerPage!: number;
  @Input() public itemsCount!: number;
  @Input() public currentPageNumber!: number;

  @Output() setItemsPerPage = new EventEmitter<ListRequest['itemsPerPage']>();
  @Output() setPageNumber = new EventEmitter<number>();

  protected get allPageNumbers(): number[] {
    const length = Math.ceil(this.itemsCount / this.currentItemsPerPage);

    return Array.from({ length }, (x, i) => i + 1);
  }

  protected onSetItemsPerPage(value: ListRequest['itemsPerPage']): void {
    this.setItemsPerPage.emit(value);
  }

  protected onSetPageNumber(value: number): void {
    this.setPageNumber.emit(value);
  }
}
