import { Component, Input, OnInit } from '@angular/core';
import { funEmoji } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';
import { User } from 'src/app/core/models';

@Component({
  selector: 'app-create-brand-option-user',
  templateUrl: './create-brand-option-user.component.html',
  styleUrls: ['./create-brand-option-user.component.scss']
})
export class CreateBrandOptionUserComponent implements OnInit {
  @Input() user!: User;
  @Input() imageSize = 32;

  ngOnInit() {
    if (!this.user.avatar) {
      this.user.avatar = createAvatar(funEmoji, {
        seed: this.user.username,
        eyes: ["closed", "closed2", "glasses", "cute", "love", "pissed", "shades", "stars"],
        mouth: ["cute", "lilSmile", "kissHeart", "tongueOut", "wideSmile", "smileTeeth", "smileLol"],
        size: 32,
        backgroundType: ["gradientLinear"],
        backgroundColor: ["b6e3f4","c0aede","d1d4f9"]
      }).toDataUriSync();
    }
  }
}
