import {Component, OnInit} from '@angular/core';
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-authorize',
  templateUrl: './authorize.component.html',
  styleUrl: './authorize.component.scss'
})
export class AuthorizeComponent implements OnInit {
  constructor(private authService: AuthService) {
  }

  async ngOnInit(): Promise<void> {
    await this.authService.handleRedirectCallback()
      .catch((err) => {
        console.log(err);
      });
    window.location.href = "/";
  }
}
