import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  policyForm!: FormGroup;
  policyId!: number;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.policyId = +this.route.snapshot.paramMap.get('id')!;
    this.initializeForm();
    this.fetchPolicy();
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
      drivers: this.fb.array([]),
      vehicles: this.fb.array([])
    });
  }

  fetchPolicy(): void {
    this.http.get(`http://localhost:8000/api/policies/${this.policyId}`).subscribe(
      (response: any) => {
        console.log('Fetched policy data:', response);
        this.patchFormWithData(response);
      },
      (error) => {
        console.error('Error fetching policy:', error);
      }
    );
  }

  patchFormWithData(policyData: any): void {
    // Patch the main policy details
    this.policyForm.patchValue({
      policyNo: policyData.policy_no,
      policyStatus: policyData.policy_status,
      policyType: policyData.policy_type,
      policyEffectiveDate: policyData.policy_effective_date,
      policyExpirationDate: policyData.policy_expiration_date,
      policyHolder: {
        firstName: policyData.policy_holder.first_name,
        lastName: policyData.policy_holder.last_name,
        address: {
          street: policyData.policy_holder.address.street,
          city: policyData.policy_holder.address.city,
          state: policyData.policy_holder.address.state,
          zip: policyData.policy_holder.address.zip
        }
      }
    });

    // Patch drivers
    if (policyData.drivers && policyData.drivers.length > 0) {
      policyData.drivers.forEach((driver: any) => {
        this.drivers.push(this.createDriverFormGroup(driver));
      });
    }

    // Patch vehicles
    if (policyData.vehicles && policyData.vehicles.length > 0) {
      policyData.vehicles.forEach((vehicle: any) => {
        const vehicleGroup = this.createVehicleFormGroup(vehicle);
        this.vehicles.push(vehicleGroup);

        // Patch coverages for each vehicle
        if (vehicle.coverages && vehicle.coverages.length > 0) {
          vehicle.coverages.forEach((coverage: any) => {
            const coveragesArray = vehicleGroup.get('coverages') as FormArray;
            coveragesArray.push(this.createCoverageFormGroup(coverage));
          });
        }
      });
    }
  }

  createDriverFormGroup(driverData?: any): FormGroup {
    return this.fb.group({
      firstName: [driverData?.firstName || '', Validators.required],
      lastName: [driverData?.lastName || '', Validators.required],
      age: [driverData?.age || null, Validators.required],
      gender: [driverData?.gender || '', Validators.required],
      maritalStatus: [driverData?.maritalStatus || '', Validators.required],
      licenseNumber: [driverData?.licenseNumber || '', Validators.required],
      licenseState: [driverData?.licenseState || '', Validators.required],
      licenseStatus: [driverData?.licenseStatus || '', Validators.required],
      licenseEffectiveDate: [driverData?.licenseEffectiveDate || '', Validators.required],
      licenseExpirationDate: [driverData?.licenseExpirationDate || '', Validators.required],
      licenseClass: [driverData?.licenseClass || '', Validators.required]
    });
  }

  createVehicleFormGroup(vehicleData?: any): FormGroup {
    return this.fb.group({
      year: [vehicleData?.year || null, Validators.required],
      make: [vehicleData?.make || '', Validators.required],
      model: [vehicleData?.model || '', Validators.required],
      vin: [vehicleData?.vin || '', Validators.required],
      usage: [vehicleData?.usage || '', Validators.required],
      primaryUse: [vehicleData?.primaryUse || '', Validators.required],
      annualMileage: [vehicleData?.annualMileage || null, Validators.required],
      ownership: [vehicleData?.ownership || '', Validators.required],
      garagingAddress: this.fb.group({
        street: [vehicleData?.garagingAddress?.street || '', Validators.required],
        city: [vehicleData?.garagingAddress?.city || '', Validators.required],
        state: [vehicleData?.garagingAddress?.state || '', Validators.required],
        zip: [vehicleData?.garagingAddress?.zip || '', Validators.required]
      }),
      coverages: this.fb.array([])
    });
  }

  createCoverageFormGroup(coverageData?: any): FormGroup {
    return this.fb.group({
      type: [coverageData?.type || '', Validators.required],
      limit: [coverageData?.limit || null, Validators.required],
      deductible: [coverageData?.deductible || null, Validators.required]
    });
  }

  get drivers(): FormArray {
    return this.policyForm.get('drivers') as FormArray;
  }

  get vehicles(): FormArray {
    return this.policyForm.get('vehicles') as FormArray;
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

  onSubmit(): void {
    if (this.policyForm.valid) {
      this.http.put(`http://localhost:8000/api/policies/${this.policyId}`, this.policyForm.value).subscribe(
        () => {
          alert('Policy updated successfully!');
          this.router.navigate(['/policies']);
        },
        (error) => {
          console.error('Error updating policy:', error);
        }
      );
    }
  }
}