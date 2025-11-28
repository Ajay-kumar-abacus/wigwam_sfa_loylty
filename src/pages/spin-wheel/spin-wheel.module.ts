import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SpinWheelPage } from './spin-wheel';
// import { createTranslateLoader } from '../redeem-type/redeem-type.module';
// import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    SpinWheelPage,
  ],
  imports: [
    IonicPageModule.forChild(SpinWheelPage),
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient]
      }
  })
  ],
})
export class SpinWheelPageModule {}
