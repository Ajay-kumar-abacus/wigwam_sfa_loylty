import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PriceListPage } from './price-list';
import { IonicSelectableModule } from 'ionic-selectable';
import { SelectSearchableModule } from 'ionic-select-searchable';

@NgModule({
  declarations: [
    PriceListPage,
  ],
  imports: [
    IonicPageModule.forChild(PriceListPage),
    IonicSelectableModule,
    SelectSearchableModule
  ],
})
export class PriceListPageModule {}
