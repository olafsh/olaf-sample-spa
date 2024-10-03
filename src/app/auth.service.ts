import { Injectable } from '@angular/core';
import OLAFSDK from "@olafsh/olaf-sdk-js";
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private OLAFSDK: any;

  constructor() {
    this.OLAFSDK = new OLAFSDK(environment.OLAF_PUBLIC_ENDPOINT);
  }

  public fetchConfig() {
    return this.OLAFSDK.fetchConfig();
  }

  public config() {
    return this.OLAFSDK.config;
  }

  public accessToken() {
    return this.OLAFSDK.accessToken;
  }

  public async isAuthenticated() {
    return await this.OLAFSDK.isAuthenticated;
  }

  public async loginWithRedirect() {
    await this.OLAFSDK.loginWithRedirect();
  }

  public async handleRedirectCallback() {
    await this.OLAFSDK.handleRedirectCallback();
  }

  public async logout() {
    await this.OLAFSDK.logout();
  }
}

export function initializeApp(authService: AuthService) {
  return async () => {
    try {
      await authService.fetchConfig();
      const isValid = await authService.isAuthenticated();
      if (isValid) {
        // TODO: Fetch user
        console.log("Authentication successful");
      } else {
        console.log("Authentication failed");
      }
    } catch (err) {
      console.error('Error during initialization', err);
    }
  };
}
