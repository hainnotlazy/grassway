import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, Observable, filter, take, tap } from 'rxjs';
import { Url } from 'src/app/core/models/url.model';

@UntilDestroy()
@Component({
  selector: 'app-bulk-select',
  templateUrl: './bulk-select.component.html',
  styleUrls: ['./bulk-select.component.scss']
})
export class BulkSelectComponent implements OnInit {
  @Input() myUrls$!: Observable<Url[]>;
  @Input() selectUrlSubject!: BehaviorSubject<Url | null>;

  @Output() selectAll = new EventEmitter<boolean | null>();

  private selectUrl$?: Observable<Url | null>;

  selectedUrls: Url[] = [];
  selectedAll = false;

  ngOnInit() {
    this.myUrls$.pipe(
      tap(() => {
        this.selectedUrls = [];
        this.selectedAll = false;
      }),
      untilDestroyed(this)
    ).subscribe();

    this.selectUrl$ = this.selectUrlSubject.asObservable();
    this.selectUrl$.pipe(
      filter(data => !!data),
      tap((url) => {
        this.handleSelectUrl(url as Url);
      }),
      untilDestroyed(this)
    ).subscribe();
  }

  selectedSome() {
    return !!(this.selectedUrls.length > 0 && !this.selectedAll);
  }

  onSelectAll() {
    this.myUrls$.pipe(
      take(1),
      tap(data => {
        if (!this.selectedAll) {
          this.selectedAll = true;
          this.selectedUrls = data;
          this.selectAll.emit(false);
          setTimeout(() => {
            this.selectAll.emit(true);
          }, 1);
        } else {
          this.selectedAll = false;
          this.selectedUrls = [];
          this.selectAll.emit(false);
        }
      }),
      untilDestroyed(this)
    ).subscribe();
  }

  handleSelectUrl(url: Url) {
    if (this.selectedUrls.find(selectedUrl => selectedUrl.id === url.id)) {
      this.selectedUrls = this.selectedUrls.filter(selectedUrl => selectedUrl.id !== url.id);
      this.selectedAll = false;
    } else {
      this.selectedUrls.push(url);
      this.myUrls$.pipe(
        tap(data => {
          this.selectedAll = data.length === this.selectedUrls.length;
        }),
        untilDestroyed(this)
      ).subscribe();
    }
  }
}
