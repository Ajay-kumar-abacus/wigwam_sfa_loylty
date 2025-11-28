import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SparePage } from './spare';

@NgModule({
  declarations: [
    SparePage,
  ],
  imports: [
    IonicPageModule.forChild(SparePage),
  ],
})
export class SparePageModule {}
