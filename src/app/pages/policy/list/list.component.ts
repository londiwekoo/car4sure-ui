import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  policies: any[] = [];

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.fetchPolicies();
  }

  // Fetch all policies from the backend
  fetchPolicies(): void {
    this.http.get('http://localhost:8000/api/policies').subscribe(
      (response: any) => {
        this.policies = response;
      },
      (error) => {
        console.error('Error fetching policies:', error);
      }
    );
  }

  // Navigate to the edit policy page
  editPolicy(policyId: number): void {
    console.log('Editing policy with ID:', policyId);
    this.router.navigate(['policies/edit', policyId]);
  }

  // Delete a policy
  deletePolicy(policyId: number): void {
    if (confirm('Are you sure you want to delete this policy?')) {
      this.http.delete(`http://localhost:8000/api/policies/${policyId}`).subscribe(
        () => {
          alert('Policy deleted successfully!');
          this.fetchPolicies();
        },
        (error) => {
          console.error('Error deleting policy:', error);
        }
      );
    }
  }
}
