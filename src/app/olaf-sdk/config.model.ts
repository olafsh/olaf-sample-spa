export class ApplicationStyles {
  s_type: string;
  name: string;
  value: string;

  constructor() {
    this.s_type = "";
    this.name = "";
    this.value = "";
  }
}

export class ConfigModel {
  account_name: string;
  api_endpoint: string;
  client_id: string;
  account_url: string;
  redirect_url: string;
  styles: ApplicationStyles[];
  expiry: number;

  constructor() {
    this.account_name = "";
    this.api_endpoint = "";
    this.client_id = "";
    this.account_url = "";
    this.redirect_url = "";
    this.styles = [];
    this.expiry = 0;
  }
}
