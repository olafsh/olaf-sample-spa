import {inject, Injectable} from "@angular/core";
import {CanActivateFn, Router} from "@angular/router";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard {
  async canActivate(router: Router, authService: AuthService): Promise<any> {
    const isAuthenticated = await authService.isAuthenticated();
    if (isAuthenticated) {
      return true;
    }
    return router.parseUrl("/");
  }
}

export const CanActivate: CanActivateFn = () => {
  return inject(AuthGuard).canActivate(inject(Router), inject(AuthService));
};

