import {APP_INITIALIZER, InjectionToken, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {OLAFService} from "./olaf-sdk/olaf.service";
import {HeaderComponent} from "./header/header.component";
import {LoaderComponent} from "./loader/loader.component";
import {AuthorizeComponent} from "./authorize/authorize.component";
import {HomeComponent} from "./home/home.component";
import {configFactory, verifyTokenFactory} from "./app.utils";

export const ConfigDeps = new InjectionToken<(() => Function)[]>("configDeps");

@NgModule({
  declarations: [
    AppComponent,
    AuthorizeComponent,
    HeaderComponent,
    LoaderComponent,
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
      useFactory: configFactory,
      multi: true,
      deps: [OLAFService, ConfigDeps],
    },
    {
      provide: ConfigDeps,
      useFactory: (OLAFService: OLAFService) => {
        return [verifyTokenFactory(OLAFService)];
      },
      deps: [OLAFService],
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
