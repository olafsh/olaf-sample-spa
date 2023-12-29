import {APP_INITIALIZER, InjectionToken, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {OLAFConfigFactory, verifyTokenFactory} from "./olaf-sdk/olaf.utils";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {OLAFService} from "./olaf-sdk/olaf.service";
import {HeaderComponent} from "./header/header.component";
import {LoaderComponent} from "./loader/loader.component";
import {AuthorizeComponent} from "./authorize/authorize.component";
import {HomeComponent} from "./home/home.component";

export const OLAFConfigDeps = new InjectionToken<(() => Function)[]>("configDeps");

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoaderComponent,
    AuthorizeComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: OLAFConfigFactory,
      multi: true,
      deps: [HttpClient, OLAFService, OLAFConfigDeps],
    },
    {
      provide: OLAFConfigDeps,
      useFactory: (http: HttpClient, OLAFService: OLAFService) => {
        return [verifyTokenFactory(http, OLAFService)];
      },
      deps: [HttpClient, OLAFService],
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
