import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TravelMonthlyAddPage } from './travel-monthly-add';
import { IonicSelectableModule } from 'ionic-selectable';
@NgModule({
  declarations: [
    TravelMonthlyAddPage,
  ],
  imports: [
    IonicPageModule.forChild(TravelMonthlyAddPage),
    IonicSelectableModule
  ],
})
export class TravelMonthlyAddPageModule {}
