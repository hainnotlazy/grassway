import { Component, Input, OnInit } from '@angular/core';
import { Tag } from 'src/app/core/models/tag.model';

@Component({
  selector: 'app-tag-badge',
  templateUrl: './tag-badge.component.html',
  styleUrls: ['./tag-badge.component.scss'],
})
export class TagBadgeComponent implements OnInit {
  @Input() tags!: Tag[];
  @Input() targetTagId!: number;

  targetTag?: Tag;

  ngOnInit() {
    this.targetTag = this.tags.find((tag) => tag.id == this.targetTagId);
  }
}
