import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TeamTrackDetailPage } from './team-track-detail';

@NgModule({
  declarations: [
    TeamTrackDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(TeamTrackDetailPage),
  ],
})
export class TeamTrackDetailPageModule {}
