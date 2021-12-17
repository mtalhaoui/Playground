import { Component, OnInit } from '@angular/core';
import { Rectangle } from '../shared/model/rectangle.model';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {
  rectangles: Rectangle[] = [];

  mouseDown: boolean = false;

  lastMouseX!: number;
  lastMouseY!: number;
  mouseX!: number;
  mouseY!: number;
  width!: number;
  height!: number;
  rightToLeft!: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  onMouseDown(e: MouseEvent) {
    this.mouseDown = true;

    this.lastMouseX = e.offsetX;
    this.lastMouseY = e.offsetY;
  }

  onMouseUp(e: MouseEvent) {
    this.mouseDown = false;

    let left = 0, top = 0;

    left = this.lastMouseX;
    top = this.lastMouseY;

    if (this.width < 0) {
      this.width *= -1;
      left = this.mouseX;
    }

    if (this.height < 0) {
      this.height *= -1;
      top = this.mouseY;
    }

    this.rectangles.push(new Rectangle(this.width, this.height, left, top));
  }

  onMouseMove(e: MouseEvent) {
    this.mouseX = e.offsetX;
    this.mouseY = e.offsetY;

    if (this.mouseDown) {
      this.width = this.mouseX - this.lastMouseX;
      this.height = this.mouseY - this.lastMouseY;
    }
  }
}
