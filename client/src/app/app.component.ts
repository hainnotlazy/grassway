import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';

export let isBrowserRefreshed = false;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router
  ) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        isBrowserRefreshed = !router.navigated;
      }
  });
  }

  ngOnInit() {
    this.cleanupUrl();
  }

  private cleanupUrl() {
    if (window.location.hash && window.location.hash == '#_=_') {
      window.location.hash = '';
    }
  }
}
