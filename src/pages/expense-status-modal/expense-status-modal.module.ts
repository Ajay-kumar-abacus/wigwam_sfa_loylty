import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExpenseStatusModalPage } from './expense-status-modal';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  declarations: [
    ExpenseStatusModalPage,
  ],
  imports: [
    IonicPageModule.forChild(ExpenseStatusModalPage),
    IonicSelectableModule
  ],
})
export class ExpenseStatusModalPageModule {}
