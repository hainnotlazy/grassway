import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs';
import { UrlsResponse, GetUrlsOptions } from 'src/app/core/interfaces';
import { UrlsService } from 'src/app/core/services';

@UntilDestroy()
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  @Input() filterOptions!: GetUrlsOptions;
  @Input() initialLoadSubject!: BehaviorSubject<UrlsResponse | null>;
  @Input() infiniteLoadSubject!: BehaviorSubject<UrlsResponse | null>;

  @Output() filterChanged =  new EventEmitter<string>();

  searchControl = new FormControl("");

  constructor(
    private urlsService: UrlsService
  ) {}

  ngOnInit() {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap((value) => {
        // Emit selected status
        this.filterChanged.emit(value as string);
      }),
      switchMap(value => {
        return this.urlsService.listUrls({
          page: 1,
          ...this.filterOptions,
          search: value as string,
        })
      }),
      tap((response) => {
        // Push new data to stream
        this.infiniteLoadSubject.next(null);
        this.initialLoadSubject.next(response);
      }),
      untilDestroyed(this)
    ).subscribe();
  }
}
