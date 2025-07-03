import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, catchError, of, Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

import { Item } from '../../models/item';
import { ItemService } from '../../services/item';
import { AssignQuantityDialog } from '../assign-quantity-dialog/assign-quantity-dialog';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-item-list',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterLink,
    CommonModule,
  ],
  templateUrl: './item-list.html',
  styleUrl: './item-list.scss',
})
export class ItemList implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = [
    'id',
    'name',
    'uniqueNumber',
    'canAssignQuantity',
    'quantity',
    'actions',
  ];
  dataSource = new MatTableDataSource<Item>();
  destroyed$ = new Subject<void>();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  pageSize = 10;

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  constructor(
    private itemService: ItemService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  private loadData(): void {
    this.loadingSubject.next(true);
    this.itemService.items$
      .pipe(
        catchError(() => of([])),
        takeUntil(this.destroyed$)
      )
      .subscribe((items) => {
        this.dataSource.data = items;
      });
  }

  assignQuantity(item: Item, event: Event): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(AssignQuantityDialog, {
      width: '400px',
      data: item,
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((result) => {
        const success = this.itemService.updateQuantity(item.id, result);
        if (success) {
          this.snackBar.open('Amount updated', 'Close', {
            duration: 2000,
          });
        } else {
          this.snackBar.open('Error during updating', 'Close', {
            duration: 2000,
          });
        }
      });
  }
}
