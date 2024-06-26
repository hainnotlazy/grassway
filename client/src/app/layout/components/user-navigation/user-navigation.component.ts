import { Component } from '@angular/core';
import { finalize, map } from 'rxjs';
import { UsersService, AuthService } from 'src/app/core/services';
import { createAvatar } from '@dicebear/core';
import { funEmoji } from '@dicebear/collection';
import { Router } from '@angular/router';
import { removeAccessToken } from 'src/app/core/helpers/local-storage.helper';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-user-navigation',
  templateUrl: './user-navigation.component.html',
  styleUrls: ['./user-navigation.component.scss'],
  host: {
    class: "select-none"
  }
})
export class UserNavigationComponent {
  isUserMenuOpen = false;
  currentUser$ = this.usersService.getCurrentUser().pipe(
    map((currentUser) => {
      if (!currentUser.avatar) {
        currentUser.avatar = createAvatar(funEmoji, {
          seed: currentUser.username,
          eyes: ["closed", "closed2", "glasses", "cute", "love", "pissed", "shades", "stars"],
          mouth: ["cute", "lilSmile", "kissHeart", "tongueOut", "wideSmile", "smileTeeth", "smileLol"],
          size: 40,
          backgroundType: ["gradientLinear"],
          backgroundColor: ["b6e3f4","c0aede","d1d4f9"]
        }).toDataUriSync();
      }
      return currentUser;
    })
  );

  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private router: Router
  ) {}

  onSignOut() {
    return this.authService.logout().pipe(
      finalize(() => {
        removeAccessToken();
        this.router.navigate(['/']);
      }),
      untilDestroyed(this)
    ).subscribe();
  }
}
