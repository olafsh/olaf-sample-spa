import {inject, Injectable} from "@angular/core";
import {CanActivateFn, Router, UrlTree} from "@angular/router";
import {OLAFService} from "./olaf.service";

@Injectable({
  providedIn: "root",
})
export class OLAFGuard {
  canActivate(router: Router, OLAFService: OLAFService): boolean | UrlTree {
    if (OLAFService.isAuthenticated) {
      return true;
    }
    return router.parseUrl("/");
  }
}

export const OLAFCanActivate: CanActivateFn = () => {
  return inject(OLAFGuard).canActivate(inject(Router), inject(OLAFService));
};

