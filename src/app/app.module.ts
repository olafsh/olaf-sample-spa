import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {HeaderComponent} from "./header/header.component";
import {LoaderComponent} from "./loader/loader.component";
import {AuthorizeComponent} from "./authorize/authorize.component";
import {HomeComponent} from "./home/home.component";
import {initializeApp, AuthService} from "./auth.service";

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
      useFactory: initializeApp,
      multi: true,
      deps: [AuthService],
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
