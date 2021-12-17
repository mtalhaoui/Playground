import { Component, Input, OnInit } from '@angular/core';
import { Rectangle } from 'src/app/shared/model/rectangle.model';

@Component({
  selector: 'app-rectangle',
  templateUrl: './rectangle.component.html',
  styleUrls: ['./rectangle.component.scss']
})
export class RectangleComponent implements OnInit {
  @Input() rectangle!: Rectangle;

  constructor() { }

  ngOnInit(): void {
  }
}
