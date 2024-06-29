import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from './layout/layout.module';
import { JwtModule } from '@auth0/angular-jwt';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { CookieService } from 'ngx-cookie-service';
import { SocketIoModule } from 'ngx-socket-io';
import { JwtConfigOptions } from './core/config';
import { NotificationSocket } from './core/sockets/notification.socket';
import { BrandsSocket } from './core/sockets/brands.socket';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    HttpClientModule,
    JwtModule.forRoot(JwtConfigOptions),
    SocketIoModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    NotificationSocket,
    BrandsSocket,
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
