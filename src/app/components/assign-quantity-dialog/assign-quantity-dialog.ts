import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Item } from '../../models/item';

@Component({
  selector: 'app-assign-quantity-dialog',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './assign-quantity-dialog.html',
  styleUrl: './assign-quantity-dialog.scss',
})
export class AssignQuantityDialog {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AssignQuantityDialog>,
    @Inject(MAT_DIALOG_DATA) public item: Item
  ) {
    this.form = this.fb.group({
      quantity: [
        item ? item.quantity : null,
        [
          Validators.required,
          Validators.pattern(/^[1-9]\d*$/), // Positive integers only
        ],
      ],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value.quantity);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
