import { Component, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormArray,
  FormBuilder,
  Validators,
  NG_VALIDATORS,
  Validator,
  AbstractControl,
  ValidationErrors,
  FormGroup,
} from '@angular/forms';

@Component({
  selector: 'app-beneficiarios',
  template: `

  <form [formGroup]="formBenef">
      <div formArrayName="beneficiarios">
        <div *ngFor="let beneficiario of beneficiarios.controls; let i = index" >
          <div [formGroupName]="i">

          <mat-form-field appearance="outline">
            <mat-label>Nombre del Beneficiario:</mat-label>
            <input id="nombre" matInput formControlName="nombre">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Parentesco:</mat-label>
            <input id="parentesco" matInput formControlName="parentesco">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Porcentaje:</mat-label>
            <input id="porcentaje" matInput formControlName="porcentaje">
          </mat-form-field>

            <button mat-raised-button (click)="removerBeneficiario(i)"color="primary">Eliminar </button>
          </div>  
        </div>
          <button mat-raised-button (click)="agregarBeneficiario()"color="primary">Agregar Benef </button>
      </div>
  </form>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BeneficiariosComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => BeneficiariosComponent),
      multi: true,
    },
  ],
})
export class BeneficiariosComponent implements ControlValueAccessor, Validator {
  formBenef: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formBenef = this.fb.group({
      beneficiarios: this.fb.array([]),
    });
  }

  // Getter para acceder al FormArray de beneficiarios
  get beneficiarios(): FormArray {
    return this.formBenef.get('beneficiarios') as FormArray;
  }

  // Método para agregar un nuevo beneficiario
  agregarBeneficiario() {
    const beneficiarioForm = this.fb.group({
      nombre: ['', Validators.required],
      parentesco: ['', Validators.required],
      porcentaje: [
        0,
        [Validators.required, Validators.min(1), Validators.max(100)],
      ],
    });
    this.beneficiarios.push(beneficiarioForm);
    this.onChange(this.formBenef.value);
  }

  // Método para eliminar un beneficiario por índice
  removerBeneficiario(index: number) {
    this.beneficiarios.removeAt(index);
    this.onChange(this.formBenef.value);
  }

  // --- ControlValueAccessor methods ---
  onChange = (value: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    if (value) {
      this.formBenef.setValue(value, { emitEvent: false });
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
    this.formBenef.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.formBenef.disable();
    } else {
      this.formBenef.enable();
    }
  }

  // --- Validator method ---
  validate(control: AbstractControl): ValidationErrors | null {
    // Validación personalizada: ejemplo de validar que la suma de los porcentajes sea 100%
    const total = this.beneficiarios.controls
      .map((beneficiario) => beneficiario.get('porcentaje')?.value)
      .reduce((acc, value) => acc + value, 0);
    return total === 100 ? null : { porcentajeInvalido: true };
  }
}
