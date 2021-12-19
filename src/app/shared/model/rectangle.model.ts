export class Rectangle {
  private xStart: number;
  private xEnd: number;
  private yStart: number;
  private yEnd: number;

  isSelected: boolean = false;

  constructor(public width: number, public height: number, public left: number, public top: number) {
    this.xStart = left;
    this.xEnd = left + width;
    this.yStart = top;
    this.yEnd = top + height;
   }

  getDimensions(): string {
    return `x start: ${this.left} - x end: ${ this.left + this.width } - y start: ${ this.top } - y end: ${ this.top + this.height }`;
  }

  isInVector(x: number, y: number): boolean {
    return this.xStart < x && this.xEnd > x && this.yStart < y && this.yEnd > y;
  }
}
