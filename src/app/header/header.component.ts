import {Component, OnInit} from '@angular/core';
import {OLAFSDKService} from "../olaf-sdk.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false;
  accountName: string | undefined;
  accountProfileUrl: string | undefined;

  constructor(private OLAFSDKService: OLAFSDKService) {
  }

  async ngOnInit(): Promise<void> {
    this.isAuthenticated = await this.OLAFSDKService.isAuthenticated();
    this.accountName = this.OLAFSDKService.config().account_name;
    this.accountProfileUrl = this.OLAFSDKService.config().account_url;
  }

  async onSignIn(): Promise<void> {
    await this.OLAFSDKService.loginWithRedirect();
  }

  async onSignOut(): Promise<void> {
    await this.OLAFSDKService.logout();
  }
}
