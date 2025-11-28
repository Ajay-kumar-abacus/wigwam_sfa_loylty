import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TargetVsAchievementPage } from './target-vs-achievement';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  declarations: [
    TargetVsAchievementPage,
  ],
  imports: [
    IonicPageModule.forChild(TargetVsAchievementPage),
    IonicSelectableModule,
  ],
})
export class TargetVsAchievementPageModule {}
