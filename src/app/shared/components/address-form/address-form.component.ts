import { ControlContainer, FormGroup, FormGroupDirective } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class AddressFormComponent implements OnInit {

  @Input() formGroup!: FormGroup;
  constructor() { }

  ngOnInit(): void {
  }

}
