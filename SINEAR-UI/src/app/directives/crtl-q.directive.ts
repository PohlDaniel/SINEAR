import {Directive, Output, EventEmitter, HostListener} from '@angular/core';

@Directive({
  selector: '[ctrlQ]'
})
export class CtrlQDirective {

  @Output() ctrlQ: EventEmitter<boolean> = new EventEmitter();
    constructor() {
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.getModifierState && event.getModifierState('Control') && event.keyCode === 81) {
      this.ctrlQ.emit(true);
    }
  }
}
