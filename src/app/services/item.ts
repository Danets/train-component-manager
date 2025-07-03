import { Injectable } from '@angular/core';
import { Item } from '../models/item';
import { HttpClient, HttpParams } from '@angular/common/http';
import { delay } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

const STORAGE_KEY = 'train-items';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private items: Item[] = [];
  private itemsSubject = new BehaviorSubject<Item[]>([]);
  items$ = this.itemsSubject.asObservable();

  constructor(private readonly http: HttpClient) {
    this.loadMockData();
  }

  private loadMockData(pageIndex: number = 0, pageSize: number = 10): void {
    const storedItems = localStorage.getItem(STORAGE_KEY);
    if (storedItems && storedItems.length > 0) {
      this.setItems(JSON.parse(storedItems));
    } else {
      const params = new HttpParams()
        .set('page', pageIndex.toString())
        .set('limit', pageSize.toString());
      this.http
        .get<Item[]>('assets/mock-data.json', { params })
        .pipe(delay(500))
        .subscribe((mock) => {
          this.setItems(mock);
        });
    }
  }

  private setItems(items: Item[]) {
    this.items = items;
    this.itemsSubject.next(items);
    this.saveItems();
  }

  saveItems(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
  }

  getAll(): Item[] {
    return this.items;
  }

  getById(id: number): Item | undefined {
    return this.items.find((item) => item.id === id);
  }

  updateQuantity(id: number, quantity: number): boolean {
    const item = this.items.find((i) => i.id === id);

    if (!item || !quantity) {
      return false;
    }

    item.quantity = quantity;
    this.saveItems();
    return true;
  }
}
