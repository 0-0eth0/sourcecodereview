import { Directive, ElementRef, HostListener } from '@angular/core';


@Directive({
    selector: 'input[numbersOnly]'
})
export class NumericValidatorDirective {
    regexStr = '^[0-9]*$';
    constructor(private _el: ElementRef) { }

    OnlyNumber:boolean=true;
    @HostListener('paste', ['$event']) blockPaste(e: KeyboardEvent) {
      e.preventDefault();
    }
    @HostListener('keydown', ['$event']) onKeyDown(event: { stopPropagation: () => void; }) {
        let e = <KeyboardEvent> event;
        if (this.OnlyNumber) {
            if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
            // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) ||
            // Allow: Ctrl+C
            //(e.keyCode == 67 && e.ctrlKey === true) ||
            // Allow: Ctrl+V
            (e.keyCode == 86 && e.ctrlKey === true) ||
            // Allow: Ctrl+X
            (e.keyCode == 88 && e.ctrlKey === true) ||
            // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
              // let it happen, don't do anything
              return;
            }
          let ch = String.fromCharCode(e.keyCode);
          let regEx =  new RegExp(this.regexStr);    
          if(regEx.test(ch) || (e.keyCode>=96 && e.keyCode<=105))
            return;
          else
             e.preventDefault();
          }
      }
}
