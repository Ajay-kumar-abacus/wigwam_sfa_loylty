import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReturnPointListingPage } from './return-point-listing';

@NgModule({
  declarations: [
    ReturnPointListingPage,
  ],
  imports: [
    IonicPageModule.forChild(ReturnPointListingPage),
  ],
})
export class ReturnPointListingPageModule {}
