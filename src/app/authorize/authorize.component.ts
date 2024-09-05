import {Component, OnInit} from '@angular/core';
import {OLAFSDKService} from "../olaf-sdk.service";

@Component({
  selector: 'app-authorize',
  templateUrl: './authorize.component.html',
  styleUrl: './authorize.component.scss'
})
export class AuthorizeComponent implements OnInit {
  constructor(private OLAFSDKService: OLAFSDKService) {
  }

  async ngOnInit(): Promise<void> {
    await this.OLAFSDKService.handleRedirectCallback()
      .catch((err) => {
        console.log(err);
      });
    window.location.href = "/";
  }
}
