import { Component } from '@angular/core';
import { map } from 'rxjs';
import { UsersService } from 'src/app/core/services/users.service';
import { createAvatar } from '@dicebear/core';
import { funEmoji } from '@dicebear/collection';

@Component({
  selector: 'app-user-navigation',
  templateUrl: './user-navigation.component.html',
  styleUrls: ['./user-navigation.component.scss']
})
export class UserNavigationComponent {
  isUserMenuOpen = false;
  currentUser$ = this.usersService.getCurrentUser().pipe(
    map((currentUser) => {
      if (!currentUser.avatar) {
        currentUser.avatar = createAvatar(funEmoji, {
          seed: currentUser.fullname,
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
    private usersService: UsersService
  ) {}
}
