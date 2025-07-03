import { Routes } from '@angular/router';
import { ItemDetails } from './components/item-details/item-details';
import { ItemList } from './components/item-list/item-list';

export const routes: Routes = [
  { path: '', redirectTo: 'items', pathMatch: 'full' },
  { path: 'items', component: ItemList },
  { path: 'items/:id', component: ItemDetails },
  { path: '**', component: ItemList },
];
