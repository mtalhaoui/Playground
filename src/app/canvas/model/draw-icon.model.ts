import { DrawIconType } from "src/app/shared/enum/draw-icon-type.enum";

export class DrawIcon {
  active: boolean = false;

  constructor(public name: DrawIconType, public path: string) { }
}
