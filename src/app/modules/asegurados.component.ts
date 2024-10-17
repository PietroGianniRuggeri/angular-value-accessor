import { Component, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormArray,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-asegurados',
  template: `
    <form [formGroup]="formGroup">
      <div formArrayName="asegurados">
        <div *ngFor="let asegurado of asegurados.controls; let i = index" [formGroupName]="i">

          <mat-form-field appearance="outline">
            <mat-label>Nombre del Asegurado:</mat-label>
            <input id="aseNomAct" matInput formControlName="aseNomAct">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Fecha de Nacimiento:</mat-label>
            <input id="aseNomAct" matInput formControlName="aseNomAct" type="date">
          </mat-form-field>
          
          <!-- Aquí insertamos el nuevo componente BeneficiariosComponent -->
          <app-beneficiarios formControlName="beneficiarios"></app-beneficiarios>
          <hr>
        </div>
      </div>
      <button mat-raised-button type="submit" color="primary" (click)="agregarAsegurado()">Agregar Asegurado 
      </button>
    </form>
    `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AseguradosComponent),
      multi: true,
    },
  ],
})
export class AseguradosComponent implements ControlValueAccessor {
  formGroup: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formGroup = this.fb.group({
      asegurados: this.fb.array([]),
    });
  }

  get asegurados(): FormArray {
    return this.formGroup.get('asegurados') as FormArray;
  }

  agregarAsegurado() {
    const aseguradoForm = this.fb.group({
      aseNomAct: ['', Validators.maxLength(80)],
      aseFecha: ['', Validators.required],
      beneficiarios: [], // Componente Beneficiarios manejará este array
    });
    this.asegurados.push(aseguradoForm);
    this.onChange(this.formGroup.value);
  }

  // --- ControlValueAccessor methods ---
  onChange = (value: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    if (value) {
      this.formGroup.setValue({ asegurados: value }, { emitEvent: false });
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
    this.formGroup.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.formGroup.disable();
    } else {
      this.formGroup.enable();
    }
  }
}
