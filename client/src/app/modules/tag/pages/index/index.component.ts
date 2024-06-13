import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, take, tap } from 'rxjs';
import { Tag } from 'src/app/core/models/tag.model';
import { TagsService } from 'src/app/core/services/tags.service';

@UntilDestroy()
@Component({
  selector: 'index-page',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexPage implements OnInit {
  editingTag: Tag | null = null;

  tagsSubject = new BehaviorSubject<Tag[]>([]);
  tags$ = this.tagsSubject.asObservable();

  constructor(
    private tagsService: TagsService
  ) {}

  ngOnInit() {
    this.getTags();
  }

  onCreateTag() {
    this.getTags();
  }

  onUpdateTag() {
    this.getTags();
  }

  onDeleteTag() {
    this.getTags();
  }

  private getTags() {
    this.tagsService.getTags().pipe(
      take(1),
      tap(tags => this.tagsSubject.next(tags)),
      untilDestroyed(this)
    ).subscribe();
  }
}
