import { ControlContainer, FormGroup, FormGroupDirective } from '@angular/forms';
import { Component, Input, OnInit, AfterViewInit, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import countries from '../../_files/countries.json';

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class AddressFormComponent implements OnInit, OnChanges {

  @Input() formGroup!: FormGroup;
  public countryAndCityList: {[key: string]: string[]} = countries;
  public countriesList = Object.keys(this.countryAndCityList);

  public cities: string[] = [];

  constructor() { }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.formGroup) {
      const countryValue = changes.formGroup.currentValue.get('address')?.get('country')?.value;

      if (countryValue) {
        this.cities = this.countryAndCityList[countryValue];
      }
    }
  }

  countryChanged(e: any) {
    this.cities = this.countryAndCityList[e];
  }

}
