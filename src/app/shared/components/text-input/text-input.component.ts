import { Component, ElementRef, Input, OnInit, Self, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss']
})
export class TextInputComponent implements OnInit, ControlValueAccessor {

  @ViewChild("input", {static: true}) input!: ElementRef;
  @Input() type: string = 'text';
  @Input() label: string = 'string';
  hide = true;

  constructor(@Self() public controlDir: NgControl) {
    this.controlDir.valueAccessor = this;
  }

  writeValue(obj: any): void {
    if (this.input) {
      this.input.nativeElement.value = obj || '';
    }
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    throw new Error('Method not implemented.');
  }

  onChange(event: Event) {}

  onTouched() {}

  ngOnInit(): void {
    const control = this.controlDir.control;
    const validator = control?.validator ? [control?.validator]: null;
    const asyncValidator = control?.asyncValidator ? [control?.asyncValidator]: null;

    control?.setValidators(validator);
    control?.setAsyncValidators(asyncValidator);
    control?.updateValueAndValidity();
  }

}
