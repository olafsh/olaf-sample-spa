import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {AuthorizeComponent} from "./authorize/authorize.component";
import {CanActivate} from "./auth.guard";

const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
  },
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [CanActivate],
  },
  {
    path: "authorize",
    component: AuthorizeComponent,
  },
  { path: "**", redirectTo: "/" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
