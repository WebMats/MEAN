import { NgModule } from '@angular/core';

import { 
  MatInputModule, 
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
  MatExpansionModule,
  MatProgressSpinnerModule,
  MatIconModule,
  MatPaginatorModule, 
  MatDialogModule } from '@angular/material';

@NgModule({
	exports: [
	MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
	]
})
export class AngularMaterialModule {}