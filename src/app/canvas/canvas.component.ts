import { Component, OnInit } from '@angular/core';
import { Observable, of, Subject, takeUntil } from 'rxjs';

import { Rectangle } from '../shared/model/rectangle.model';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {
  rectangles: Rectangle[] = [];
  drawIcons: DrawIcon[] = [];
  currentRectangle!: Rectangle;
  mouseDown: boolean = false;
  mouseX!: number;
  mouseY!: number;
  lastMouseX!: number;
  lastMouseY!: number;
  width!: number;
  height!: number;
  top!: number;
  activeDrawIcon!: string;

  constructor() {
    this.currentRectangle = this.emptyRectangle();
    this.resetState();
    this.activeDrawIcon = "";
  }

  ngOnInit(): void {
    this.drawIcons = [
      new DrawIcon("MoveIcon", "../../assets/move-icon.svg", false),
      new DrawIcon("ArrowPointer", "../../assets/arrow-pointer.svg", false)
    ]
  }

  onMouseDown(e: MouseEvent) {
    if (this.activeDrawIcon === "") {
      alert("Choose a drawing option");
    }

    if (this.activeDrawIcon === "ArrowPointer") {
      this.mouseDown = true;
      this.lastMouseX = e.offsetX;
      this.lastMouseY = e.offsetY;
    }

    if (this.activeDrawIcon == "MoveIcon") {
      this.rectangles.filter(rectangle => {
        if (rectangle.isInVector(e.pageX, e.pageY)) {
          rectangle.isSelected = true;
        } else {
          rectangle.isSelected = false;
        }
      });
    }
  }

  onMouseUp(e: MouseEvent) {
    if (!this.mouseDown) return;

    let finalise = new Subject<void>();
    this.getRectangle()
      .pipe(takeUntil(finalise))
      .subscribe((rectangle: Rectangle) => {
        if (rectangle.width !== 0 && rectangle.height !== 0) {
          this.rectangles.push(rectangle);
        }
        this.currentRectangle = this.emptyRectangle();
        this.resetState();
        finalise.next();
        finalise.complete();
      });
  }

  onMouseMove(e: MouseEvent) {
    this.mouseX = e.pageX;
    this.mouseY = e.pageY;

    if (this.mouseDown) {
      this.width = this.mouseX - this.lastMouseX;
      this.height = this.mouseY - this.lastMouseY;

      let finalise = new Subject<void>();
      this.getRectangle()
        .pipe(takeUntil(finalise))
        .subscribe((rectangle: Rectangle) => {
          this.currentRectangle = rectangle;
          finalise.next();
          finalise.complete();
        });
    }
  }

  changeDrawIcon(icon: DrawIcon): void {
    this.drawIcons.forEach(drawIcon => {
      drawIcon.active = false;
    });
    icon.active = true;
    this.activeDrawIcon = icon.name;
  }

  private getRectangle(): Observable<Rectangle> {
    let left = this.lastMouseX,
      top = this.lastMouseY,
      width = this.width,
      height = this.height;

    if (this.top === 0) {
      this.top = top;
    }

    if (this.width < 0) {
      width *= -1;
      left = this.mouseX;
    }

    if (this.height < 0) {
      height *= -1;
      top = this.mouseY;
    }

    if (this.top === top && width !== 0 && height !== 0) {
      // console.log("width: ", width, " height: ", height, " left: ", left, " top: ", this.top);
      return of(new Rectangle(width, height, left, this.top));
    } else {
      return of(this.emptyRectangle());
    }
  }

  private emptyRectangle(): Rectangle {
    return new Rectangle(0, 0, 0, 0);
  }

  resetState(): void {
    this.mouseDown = false;
    this.mouseX = 0;
    this.mouseY = 0;
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    this.width = 0;
    this.height = 0;
    this.top = 0;
  }
}

export class DrawIcon {
  constructor(public name: string, public path: string, public active: boolean) { }
}
