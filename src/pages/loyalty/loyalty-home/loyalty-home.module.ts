import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoyaltyHomePage } from './loyalty-home';
import { IonicSelectableModule } from 'ionic-selectable';
import { SelectSearchableModule } from 'ionic-select-searchable';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
@NgModule({
  declarations: [
    LoyaltyHomePage,
  ],
  imports: [
    IonicPageModule.forChild(LoyaltyHomePage),
    IonicSelectableModule,
    SelectSearchableModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
})
export class LoyaltyHomePageModule {}
