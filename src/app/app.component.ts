import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl,FormArray, FormBuilder } from '@angular/forms'
 
@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  title = 'FormArray Example in Angular Reactive forms';
 
  formPadre: FormGroup;
 
  constructor(private fb:FormBuilder) {
 
    this.formPadre = this.fb.group({
      poliza: [''],
      asegurados: [] // Control para el componente AseguradosComponent
    });
  
  }

 

 
  
 
}
