import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExpenseAddNewPage } from './expense-add-new';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  declarations: [
    ExpenseAddNewPage,
  ],
  imports: [
    IonicPageModule.forChild(ExpenseAddNewPage),
    IonicSelectableModule
  ],
})
export class ExpenseAddNewPageModule {}
