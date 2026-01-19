import { Injectable, inject } from '@angular/core';
import { Database } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { onValue, push, ref, set, off } from 'firebase/database';

export interface Contact {
  firstName: string;
  lastName: string;
  position?: string;
  phone?: string;
}

export interface Company {
  id?: string;
  companyName: string;
  companyCode?: string;
  vatCode?: string;
  address?: string;
  email: string;
  phone?: string;
  contacts: Contact[];
}

@Injectable({ providedIn: 'root' })
export class CompanyDbService {
  private db = inject(Database);

  async addCompany(company: Company): Promise<string> {
    const listRef = ref(this.db, 'companies');
    const newRef = push(listRef);
    await set(newRef, company);
    return newRef.key as string;
  }

  companies$(): Observable<Company[]> {
    const companiesRef = ref(this.db, 'companies');

    return new Observable<Company[]>((subscriber) => {
      const unsubscribe = onValue(
        companiesRef,
        (snap) => {
          const val = snap.val() ?? {};
          const list: Company[] = Object.entries(val).map(([id, item]) => ({
            id,
            ...(item as Company),
          }));
          subscriber.next(list);
        },
        (err) => subscriber.error(err)
      );

      return () => {
        off(companiesRef);
        unsubscribe();
      };
    });
  }
}
