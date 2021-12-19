import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Observable, of, Subject, takeUntil } from 'rxjs';
import { DrawIconType } from 'src/app/shared/enum/draw-icon-type.enum';

import { RectangleHelper } from 'src/app/shared/model/rectangle-helper.model';
import { Rectangle } from 'src/app/shared/model/rectangle.model';

@Component({
  selector: 'app-mushaf-page',
  templateUrl: './mushaf-page.component.html',
  styleUrls: ['./mushaf-page.component.scss']
})
export class MushafPageComponent {
  @Input() activeDrawIcon!: DrawIconType;
  @Output() currentRectangleEvent = new EventEmitter<Rectangle>();
  @Output() rectangleHelperEvent = new EventEmitter<RectangleHelper>();
  @Output() selectedRectangleHelperEvent = new EventEmitter<RectangleHelper>();

  rectangles: Rectangle[] = [];
  currentRectangle: Rectangle;
  selectedRectangle: Rectangle;
  // This is just for showing the dimensions
  rectangleHelper: RectangleHelper;
  selectedRectangleHelper: RectangleHelper;

  width!: number;
  height!: number;
  top!: number;

  constructor() {
    this.currentRectangle = this.emptyRectangle();
    this.selectedRectangle = this.emptyRectangle();
    this.rectangleHelper = new RectangleHelper();
    this.selectedRectangleHelper = new RectangleHelper();
    this.resetState();
  }

  onMouseDown(e: MouseEvent): void {
    if (this.activeDrawIcon === DrawIconType.None) {
      alert("Choose a drawing option");
    } else if (this.activeDrawIcon === DrawIconType.ArrowPointer) {
      this.rectangleHelper.mouseDown = true;
      this.rectangleHelper.lastMouseX = e.offsetX;
      this.rectangleHelper.lastMouseY = e.offsetY;
      this.rectangleHelperEvent.emit(this.rectangleHelper);
    } else if (this.activeDrawIcon === DrawIconType.Move) {
      this.rectangles.filter(rectangle => {
        if (rectangle.isInVector(e.pageX, e.pageY)) {
          rectangle.isSelected = true;
          this.selectedRectangle = rectangle;
          this.currentRectangleEvent.emit(rectangle);

          this.selectedRectangleHelper.lastMouseX = e.pageX;
          this.selectedRectangleHelper.lastMouseY = e.pageY;
          this.selectedRectangleHelper.mouseDown = true;
          this.selectedRectangleHelperEvent.emit(this.selectedRectangleHelper);
        } else {
          rectangle.isSelected = false;
        }
      });
    }
  }

  onMouseUp(e: MouseEvent): void {
    if (this.activeDrawIcon === DrawIconType.ArrowPointer) {
      if (!this.rectangleHelper.mouseDown) return;

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
    } else if (this.activeDrawIcon === DrawIconType.Move) {
      this.selectedRectangleHelper.mouseDown = false;
    }
  }

  onMouseMove(e: MouseEvent): void {
    if (this.activeDrawIcon === DrawIconType.ArrowPointer) {
      this.rectangleHelper.mouseX = e.pageX;
      this.rectangleHelper.mouseY = e.pageY;
      this.rectangleHelperEvent.emit(this.rectangleHelper);
      if (this.rectangleHelper.mouseDown) {
        this.width = this.rectangleHelper.mouseX - this.rectangleHelper.lastMouseX;
        this.height = this.rectangleHelper.mouseY - this.rectangleHelper.lastMouseY;

        let finalise = new Subject<void>();
        this.getRectangle()
          .pipe(takeUntil(finalise))
          .subscribe((rectangle: Rectangle) => {
            this.currentRectangle = rectangle;
            this.currentRectangleEvent.emit(rectangle);
            finalise.next();
            finalise.complete();
          });
      }
    } else if (this.activeDrawIcon === DrawIconType.Move) {
      this.selectedRectangleHelper.mouseX = e.pageX;
      this.selectedRectangleHelper.mouseY = e.pageY;
      this.selectedRectangleHelperEvent.emit(this.selectedRectangleHelper);

      if (this.selectedRectangle.isSelected && this.selectedRectangleHelper.mouseDown) {
        this.selectedRectangle.left += this.selectedRectangleHelper.mouseX - this.selectedRectangleHelper.lastMouseX;
        this.selectedRectangle.top += this.selectedRectangleHelper.mouseY - this.selectedRectangleHelper.lastMouseY;

        this.selectedRectangleHelper.lastMouseX = this.selectedRectangleHelper.mouseX;
        this.selectedRectangleHelper.lastMouseY = this.selectedRectangleHelper.mouseY;
      }
    }
  }

  private getRectangle(): Observable<Rectangle> {
    let left = this.rectangleHelper.lastMouseX,
      top = this.rectangleHelper.lastMouseY,
      width = this.width,
      height = this.height;

    if (this.top === 0) {
      this.top = top;
    }

    if (this.width < 0) {
      width *= -1;
      left = this.rectangleHelper.mouseX;
    }

    if (this.height < 0) {
      height *= -1;
      top = this.rectangleHelper.mouseY;
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

  private resetState(): void {
    this.rectangleHelper.mouseDown = false;
    this.rectangleHelper.mouseX = 0;
    this.rectangleHelper.mouseY = 0;
    this.rectangleHelper.lastMouseX = 0;
    this.rectangleHelper.lastMouseY = 0;
    this.width = 0;
    this.height = 0;
    this.top = 0;
  }
}
