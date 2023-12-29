import { Component } from '@angular/core';
import {OLAFService} from "../olaf-sdk/olaf.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isAuthenticated = false;
  accountProfileUrl: string | undefined;

  constructor(private OLAFService: OLAFService) {
    this.isAuthenticated = this.OLAFService.isAuthenticated;
    this.accountProfileUrl = this.OLAFService.config?.account_url;
  }

  onSignIn() {
    this.OLAFService.loginWithRedirect().then((authorizeUrl) => {
      window.location.assign(authorizeUrl);
    });
  }

  onSignOut() {
    this.OLAFService.logout();
  }
}
