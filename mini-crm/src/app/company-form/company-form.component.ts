import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyDbService, Company } from '../services/company-db.service';
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
export class CompanyFormComponent implements OnInit {
  form: FormGroup;

  // ---- UI states ----
  companies: Company[] = [];
  isLoading = true;

  saveLoading = false;
  errorMsg = '';
  successMsg = '';

  constructor(private fb: FormBuilder, private db: CompanyDbService) {
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

  ngOnInit(): void {
    this.isLoading = true;

    this.db.companies$().subscribe({
      next: (list) => {
        this.companies = list;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Failed to load companies (DB error / rules).';
        this.isLoading = false;
      }
    });
  }

  // ---------- Contacts ----------
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

  // ---------- Submit (SAVE) ----------
  async onRegister(): Promise<void> {
    this.successMsg = '';
    this.errorMsg = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: Company = this.form.value;

    try {
      this.saveLoading = true;
      const id = await this.db.addCompany(payload);
      console.log('SAVED:', id, payload);
      this.successMsg = 'Saved successfully ✅';
    } catch (err) {
      console.error(err);
      this.errorMsg = 'Failed to save company (DB error / rules).';
    } finally {
      this.saveLoading = false;
    }
  }

  // ---------- Validators ----------
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

  // ---------- Helpers ----------
  isInvalid(path: string): boolean {
    const c = this.form.get(path);
    return !!c && c.invalid && (c.touched || c.dirty);
  }

  contactInvalid(i: number, field: string): boolean {
    const c = this.contacts.at(i).get(field);
    return !!c && c.invalid && (c.touched || c.dirty);
  }
}
