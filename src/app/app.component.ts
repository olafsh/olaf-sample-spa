import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  @ViewChild('splashScreen') private draggableElement: ElementRef | undefined;

  constructor() {
  }

  ngOnInit() {
    this.draggableElement?.nativeElement.remove();
  }
}
