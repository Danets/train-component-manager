import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

import { Item } from '../../models/item';
import { ItemService } from '../../services/item';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-item-details',
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './item-details.html',
  styleUrl: './item-details.scss',
})
export class ItemDetails implements OnInit, OnDestroy {
  item: Item | undefined;
  private route = inject(ActivatedRoute);
  public router = inject(Router);
  private itemService = inject(ItemService);
  destroyed$ = new Subject<void>();

  ngOnInit(): void {
    // const id = Number(this.route.snapshot.paramMap.get('id'));
    // this.item = this.itemService.getById(id);
    this.route.params
      .pipe(takeUntil(this.destroyed$))
      .subscribe(
        (params) => (this.item = this.itemService.getById(+params['id']))
      );
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
