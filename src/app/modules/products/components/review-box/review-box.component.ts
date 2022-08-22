import { ReviewOutDto } from './../../models/reviewDto';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-review-box',
  templateUrl: './review-box.component.html',
  styleUrls: ['./review-box.component.scss']
})
export class ReviewBoxComponent implements OnInit {

  @Input() review!: ReviewOutDto;

  constructor() { }

  ngOnInit(): void {
  }

}
