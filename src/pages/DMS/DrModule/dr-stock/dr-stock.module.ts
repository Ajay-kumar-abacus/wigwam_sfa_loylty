import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DrStockPage } from './dr-stock';

@NgModule({
  declarations: [
    DrStockPage,
  ],
  imports: [
    IonicPageModule.forChild(DrStockPage),
  ],
})
export class DrStockPageModule {}
