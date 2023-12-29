import { Component } from '@angular/core';
import {LoaderComponent} from "../loader/loader.component";
import {OLAFService} from "../olaf-sdk/olaf.service";

@Component({
  selector: 'app-authorize',
  templateUrl: './authorize.component.html',
  styleUrl: './authorize.component.scss'
})
export class AuthorizeComponent {
  constructor(private OLAFService: OLAFService) {
    this.OLAFService.handleRedirectCallback().subscribe({
      next: () => {
        window.location.href = "/";
      },
      error: (error) => console.log(error)
    })
  }
}
