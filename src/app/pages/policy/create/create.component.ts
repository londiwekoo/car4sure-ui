import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-policy',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  policyForm!: FormGroup;
  visitedTabs: boolean[] = [false, false, false, false];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.policyForm = this.fb.group({
      policyNo: ['', Validators.required],
      policyStatus: ['', Validators.required],
      policyType: ['', Validators.required],
      policyEffectiveDate: ['', Validators.required],
      policyExpirationDate: ['', Validators.required],
      policyHolder: this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        address: this.fb.group({
          street: ['', Validators.required],
          city: ['', Validators.required],
          state: ['', Validators.required],
          zip: ['', Validators.required]
        })
      }),
      drivers: this.fb.array([this.createDriverFormGroup()]),
      vehicles: this.fb.array([this.createVehicleFormGroup()])
    });
  }

  createDriverFormGroup(): FormGroup {
    return this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      age: [null, Validators.required],
      gender: ['', Validators.required],
      maritalStatus: ['', Validators.required],
      licenseNumber: ['', Validators.required],
      licenseState: ['', Validators.required],
      licenseStatus: ['', Validators.required],
      licenseEffectiveDate: ['', Validators.required],
      licenseExpirationDate: ['', Validators.required],
      licenseClass: ['', Validators.required]
    });
  }

  createVehicleFormGroup(): FormGroup {
    return this.fb.group({
      year: [null, Validators.required],
      make: ['', Validators.required],
      model: ['', Validators.required],
      vin: ['', Validators.required],
      usage: ['', Validators.required],
      primaryUse: ['', Validators.required],
      annualMileage: [null, Validators.required],
      ownership: ['', Validators.required],
      garagingAddress: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zip: ['', Validators.required]
      }),
      coverages: this.fb.array([this.createCoverageFormGroup()])
    });
  }

  createCoverageFormGroup(): FormGroup {
    return this.fb.group({
      type: ['', Validators.required],
      limit: [null, Validators.required],
      deductible: [null, Validators.required]
    });
  }

  get drivers(): FormArray {
    return this.policyForm.get('drivers') as FormArray;
  }

  removeDriver(index: number) {
    this.drivers.removeAt(index);
  }

  get vehicles(): FormArray {
    return this.policyForm.get('vehicles') as FormArray;
  }
  removeVehicle(index: number) {
    this.vehicles.removeAt(index);
  }

  getCoverages(vehicleIndex: number): FormArray {
    return this.vehicles.at(vehicleIndex).get('coverages') as FormArray;
  }

  addDriver(): void {
    this.drivers.push(this.createDriverFormGroup());
  }

  addVehicle(): void {
    this.vehicles.push(this.createVehicleFormGroup());
  }

  addCoverage(vehicleIndex: number): void {
    this.getCoverages(vehicleIndex).push(this.createCoverageFormGroup());
  }


  onTabChange(event: any) {
    this.visitedTabs[event.index] = true;
  }

  allTabsVisited(): boolean {
    return this.visitedTabs.every(visited => visited);
  }

  onSubmit(): void {
    if (this.policyForm.valid) {
      const policyData = this.policyForm.value;
      console.log('Submitting policy data:', JSON.stringify(policyData));

      // Send the data to the backend
      this.http.post('http://127.0.0.1:8000/api/policies', policyData).subscribe(
        (response) => {
          console.log('Policy created successfully:', response);
          alert('Policy created successfully!');
          this.router.navigate(['/policies']);
        },
        (error) => {
          console.error('Error creating policy:', error);
          alert('Error creating policy: ' + error.message);
        }
      );
    } else {
      console.log('Form is invalid:', this.policyForm);
      console.log(this.policyForm.errors);
      Object.keys(this.policyForm.controls).forEach((key) => {
        console.log(key, this.policyForm.get(key)?.errors);
      });

      alert('Please fill out the form correctly.');
    }
  }
}