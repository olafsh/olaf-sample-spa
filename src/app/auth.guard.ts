import {inject, Injectable} from "@angular/core";
import {CanActivateFn, Router} from "@angular/router";
import {OLAFSDKService} from "./olaf-sdk.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard {
  async canActivate(router: Router, OLAFSDKService: OLAFSDKService): Promise<any> {
    const isAuthenticated = await OLAFSDKService.isAuthenticated();
    if (isAuthenticated) {
      return true;
    }
    return router.parseUrl("/");
  }
}

export const CanActivate: CanActivateFn = () => {
  return inject(AuthGuard).canActivate(inject(Router), inject(OLAFSDKService));
};

