import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  ngOnInit() {
    this.cleanupUrl();
  }

  private cleanupUrl() {
    if (window.location.hash && window.location.hash == '#_=_') {
      window.location.hash = '';
    }
  }
}
