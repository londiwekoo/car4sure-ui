import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PolicyService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getPolicies(): Observable<any> {
    return this.httpClient.get('api/policies');
  }
}
