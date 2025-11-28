import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopRequisitionAddPage } from './pop-requisition-add';

@NgModule({
  declarations: [
    PopRequisitionAddPage,
  ],
  imports: [
    IonicPageModule.forChild(PopRequisitionAddPage),
  ],
})
export class PopRequisitionAddPageModule {}
