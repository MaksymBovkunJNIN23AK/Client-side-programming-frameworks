import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-company-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './company-form.component.html',
})
export class CompanyFormComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      companyName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      companyCode: ['', [this.optionalPattern(/^\d+$/)]],             
      vatCode: ['', [this.optionalPattern(/^(LT\d+|\d+)$/)]],         
      address: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [this.optionalPhoneValidator()]],                   
      contacts: this.fb.array([this.createContactGroup()])            
    });
  }

  get contacts(): FormArray {
    return this.form.get('contacts') as FormArray;
  }

  createContactGroup(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      position: [''],
      phone: ['', [this.optionalPhoneValidator()]],
    });
  }

  addContact(): void {
    this.contacts.push(this.createContactGroup());
  }

  removeContact(i: number): void {
    if (this.contacts.length > 1) this.contacts.removeAt(i);
  }

  onRegister(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      console.warn('Form invalid:', this.form.value);
      return;
    }

    console.log('REGISTER DATA:', this.form.value);
  }

  optionalPattern(regex: RegExp) {
    return (control: AbstractControl): ValidationErrors | null => {
      const v = (control.value ?? '').toString().trim();
      if (!v) return null;
      return regex.test(v) ? null : { pattern: true };
    };
  }

  optionalPhoneValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const v = (control.value ?? '').toString().trim();
      if (!v) return null;

      const formatOk = /^\+\d+$/.test(v);
      const lenOk = v.length >= 10 && v.length <= 12;

      return formatOk && lenOk
        ? null
        : { phone: { requiredFormat: '+37065312345', requiredLength: '10–12' } };
    };
  }

  isInvalid(path: string): boolean {
    const c = this.form.get(path);
    return !!c && c.invalid && (c.touched || c.dirty);
  }

  contactInvalid(i: number, field: string): boolean {
    const c = this.contacts.at(i).get(field);
    return !!c && c.invalid && (c.touched || c.dirty);
  }
}
