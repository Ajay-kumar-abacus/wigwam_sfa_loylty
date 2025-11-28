import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BackgroundTrackListingPage } from './background-track-listing';
import { IonicSelectableModule } from 'ionic-selectable';
import { SelectSearchableModule } from 'ionic-select-searchable';

@NgModule({
  declarations: [
    BackgroundTrackListingPage,
  ],
  imports: [
    IonicPageModule.forChild(BackgroundTrackListingPage),
    IonicSelectableModule,
    SelectSearchableModule
  ],
})
export class BackgroundTrackListingPageModule {}
