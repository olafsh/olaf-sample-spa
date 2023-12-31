import {inject, Injectable} from "@angular/core";
import {CanActivateFn, Router, UrlTree} from "@angular/router";
import {OLAFService} from "./olaf-sdk/olaf.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard {
  canActivate(router: Router, OLAFService: OLAFService): boolean | UrlTree {
    if (OLAFService.isAuthenticated) {
      return true;
    }
    return router.parseUrl("/");
  }
}

export const CanActivate: CanActivateFn = () => {
  return inject(AuthGuard).canActivate(inject(Router), inject(OLAFService));
};

