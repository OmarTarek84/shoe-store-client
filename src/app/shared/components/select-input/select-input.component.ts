import { NgControl, ControlValueAccessor } from '@angular/forms';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, Self, SimpleChanges, ViewChild } from '@angular/core';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-select-input',
  templateUrl: './select-input.component.html',
  styleUrls: ['./select-input.component.scss']
})
export class SelectInputComponent implements OnInit, ControlValueAccessor {

  @ViewChild('selectInput', {static: false}) selectInput!: MatSelect;

  @Input() label: string = '';
  @Input() displayValue: string = '';
  @Input() value: string = '';
  @Input() options: any[] = [];

  @Output() selectInputChanged = new EventEmitter<any>();

  constructor(@Self() public controlDir: NgControl) {
    this.controlDir.valueAccessor = this;
  }
  ngOnInit(): void {
    const control = this.controlDir.control;
    const validator = control?.validator ? [control?.validator]: null;

    control?.setValidators(validator);
    control?.updateValueAndValidity();
  }

  writeValue(obj: any): void {

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

  inputChanged(value: any) {
    this.selectInputChanged.emit(value);
  }

  onChange(event: any) {

  }

  onTouched(event: any) {}


}
