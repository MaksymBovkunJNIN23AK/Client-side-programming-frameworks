import { Component } from '@angular/core';
import { CompanyFormComponent } from './company-form/company-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CompanyFormComponent],
  template: `<app-company-form></app-company-form>`,
})
export class AppComponent {}
