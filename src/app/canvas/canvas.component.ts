import { Component, OnInit } from '@angular/core';
import { DrawIconType } from '../shared/enum/draw-icon-type.enum';
import { RectangleHelper } from '../shared/model/rectangle-helper.model';
import { Rectangle } from '../shared/model/rectangle.model';
import { DrawIcon } from './model/draw-icon.model';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {
  drawIcons: DrawIcon[] = [];
  activeDrawIcon!: DrawIconType;
  currentRectangle!: Rectangle;
  rectangleHelper!: RectangleHelper;
  selectedRectangleHelper!: RectangleHelper;

  constructor() {
    this.activeDrawIcon = DrawIconType.None;
  }

  ngOnInit(): void {
    this.drawIcons = [
      new DrawIcon(DrawIconType.Move, "../../assets/move-icon.svg"),
      new DrawIcon(DrawIconType.ArrowPointer, "../../assets/arrow-pointer.svg")
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

  assignSelectedRectangleHelper(rectangleHelper: RectangleHelper): void {
    this.selectedRectangleHelper = rectangleHelper;
  }
}
