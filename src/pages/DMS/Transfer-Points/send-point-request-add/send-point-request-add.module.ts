import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendPointRequestAddPage } from './send-point-request-add';
import { SelectSearchableModule } from 'ionic-select-searchable';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  declarations: [
    SendPointRequestAddPage,
  ],
  imports: [
    IonicPageModule.forChild(SendPointRequestAddPage),
    IonicSelectableModule,
    SelectSearchableModule
  ],
})
export class SendPointRequestAddPageModule {}
