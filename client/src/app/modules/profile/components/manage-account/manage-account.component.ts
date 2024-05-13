import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { tap } from 'rxjs';
import { profileRequirements } from 'src/app/core/constants/form-requirement.const';
import { ValidationMessage } from 'src/app/core/interfaces/form.interface';
import { UsersService } from 'src/app/core/services/users.service';

@UntilDestroy()
@Component({
  selector: 'app-manage-account',
  templateUrl: './manage-account.component.html',
  styleUrls: ['./manage-account.component.scss']
})
export class ManageAccountComponent implements OnInit {
  @ViewChild("avatarInput") avatarInput?: ElementRef;

  formError = "";
  avatarUrl = "";

  // Form Requirements
  fullnameRequirements = profileRequirements.fullname.requirements;
  bioRequirements = profileRequirements.bio.requirements;

  // Form Validation Messages
  fullnameValidationMessages: ValidationMessage = profileRequirements.fullname.validationMsg;
  bioValidationMessages: ValidationMessage = profileRequirements.bio.validationMsg;

  manageAccountForm = new FormGroup({
    fullname: new FormControl("", [
      Validators.required,
      Validators.minLength(this.fullnameRequirements.minlength),
      Validators.maxLength(this.fullnameRequirements.maxlength)
    ]),
    dob: new FormControl(new Date()),
    phone: new FormControl(""),
    gender: new FormControl(""),
    bio: new FormControl("", [
      Validators.maxLength(this.bioRequirements.maxlength)
    ]),
    avatar: new FormControl(null)
  })

  constructor(
    private usersService: UsersService
  ) {}

  ngOnInit() {
    this.usersService.getCurrentUser().pipe(
      tap((currentUser) => {
        this.manageAccountForm.patchValue({
          fullname: currentUser.fullname,
          dob: currentUser.dob,
          phone: currentUser.phone,
          gender: currentUser.gender,
          bio: currentUser.bio,
        });

        this.avatarUrl = currentUser.avatar;
      }),
      untilDestroyed(this)
    ).subscribe();
  }

  openSelectAvatar() {
    if (this.avatarInput) {
      this.avatarInput.nativeElement.click();
    }
  }

  onAvatarChange(event: Event) {
    const fileList = (event.target as HTMLInputElement).files;

    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.avatarUrl = e.target.result;
      };
      reader.readAsDataURL(file);
      this.manageAccountForm.patchValue({ avatar: file as any });
    }
  }
}
