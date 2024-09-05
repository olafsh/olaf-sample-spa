import { Injectable } from '@angular/core';
import OLAFSDK from "@olafsh/olaf-sdk-js";
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class OLAFSDKService {
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

  public async isAuthenticated() {
    return await this.OLAFSDK.isAuthenticated;
  }

  public async loginWithRedirect() {
    await this.OLAFSDK.loginWithRedirect();
  }

  public async handleRedirectCallback() {
    await this.OLAFSDK.handleRedirectCallback();
  }

  public async  logout() {
    await this.OLAFSDK.logout();
  }
}

export function initializeApp(OLAFSDKService: OLAFSDKService) {
  return async () => {
    try {
      await OLAFSDKService.fetchConfig();
      const isValid = await OLAFSDKService.isAuthenticated();
      if (isValid) {
        console.log("Authentication successful");
      } else {
        console.log("Authentication failed");
      }
    } catch (err) {
      console.error('Error during initialization', err);
    }
  };
}
