import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContractorMeetDetailPage } from './contractor-meet-detail';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  declarations: [
    ContractorMeetDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ContractorMeetDetailPage),
    IonicSelectableModule
  ],
})
export class ContractorMeetDetailPageModule { }
