export class AuthModel {
  access_token: string;
  refresh_token: string;
  expires_in: Date;

  constructor(data: any) {
    this.access_token = data.access_token;
    this.refresh_token = data.refresh_token;
    const expires_at = new Date();
    expires_at.setSeconds(expires_at.getSeconds() + data.expires_in);
    this.expires_in = expires_at;
  }
}
