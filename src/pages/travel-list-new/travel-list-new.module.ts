import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IonicSelectableModule } from 'ionic-selectable';
import { TravelListNewPage } from './travel-list-new';
import { TooltipsModule } from 'ionic-tooltips';


@NgModule({
  declarations: [
    TravelListNewPage,
  ],
  imports: [
    IonicPageModule.forChild(TravelListNewPage),
    IonicSelectableModule,
    TooltipsModule.forRoot()

  ],
})
export class TravelListNewPageModule {}
