import {Component, OnInit} from '@angular/core';
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false;
  accountName: string | undefined;
  accountProfileUrl: string | undefined;

  constructor(private authService: AuthService) {
  }

  async ngOnInit(): Promise<void> {
    this.isAuthenticated = await this.authService.isAuthenticated();
    this.accountName = this.authService.config().account_name;
    this.accountProfileUrl = this.authService.config().account_url;
  }

  async onSignIn(): Promise<void> {
    await this.authService.loginWithRedirect();
  }

  async onSignOut(): Promise<void> {
    await this.authService.logout();
  }
}
