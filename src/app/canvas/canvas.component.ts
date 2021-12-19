import { Component, OnInit } from '@angular/core';
import { RectangleHelper } from '../shared/model/rectangle-helper.model';
import { Rectangle } from '../shared/model/rectangle.model';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {
  drawIcons: DrawIcon[] = [];
  activeDrawIcon!: string;
  currentRectangle!: Rectangle;
  rectangleHelper!: RectangleHelper;

  constructor() {
    this.activeDrawIcon = "";
  }

  ngOnInit(): void {
    this.drawIcons = [
      new DrawIcon("MoveIcon", "../../assets/move-icon.svg", false),
      new DrawIcon("ArrowPointer", "../../assets/arrow-pointer.svg", false)
    ]
  }

  changeDrawIcon(icon: DrawIcon): void {
    this.drawIcons.forEach(drawIcon => {
      drawIcon.active = false;
    });
    icon.active = true;
    this.activeDrawIcon = icon.name;
  }

  assignCurrentRectangle(rectangle: Rectangle): void {
    this.currentRectangle = rectangle;
  }

  assignRectangleHelper(rectangleHelper: RectangleHelper): void {
    this.rectangleHelper = rectangleHelper;
  }
}

export class DrawIcon {
  constructor(public name: string, public path: string, public active: boolean) { }
}
