import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators,FormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Output() cancelRegister = new EventEmitter();


  registerForm: FormGroup;
  maxDate: Date;
  validationErrors: string[] = [];

  constructor(private accountService: AccountService, private toastr: ToastrService, private fb: FormBuilder, private router: Router) {
    
   }

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() -18 );

  }

  //metodo do curso que nao funciona
  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => { 
      console.log(control?.value,control?.parent?.controls[matchTo].value);
      console.log(control?.value === control?.parent?.get(matchTo).value ? null : {isMatching: true });
      return control?.value === control?.parent?.get(matchTo).value ? null : {isMatching: true };
    }
  }

  initializeForm(){ 
    this.registerForm = this.fb.group({
      gender: ['male'],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['',[Validators.required, Validators.maxLength(8), Validators.minLength(4)]],
      confirmPassword: ['',[Validators.required, this.matchValues('password')]]
    }//,[CustomValidators.MatchValidator('password', 'confirmPassword')] //pode fazer assim, e simplesmente ignorar as linhas a seguir e o matchValues
    )
    this.registerForm.controls.password.valueChanges.subscribe(() => { 
      this.registerForm.controls.confirmPassword.updateValueAndValidity();
    })
  }

  register() {    
    this.accountService.register(this.registerForm.value).subscribe( response => {
      this.router.navigateByUrl('/members');      
      this.cancel();
    }, error => {
      this.validationErrors = error;      
    })
  }

  cancel() {
    console.log('Cancel');
    this.cancelRegister.emit(false);
  }

}



export class CustomValidators {
  static MatchValidator(source: string, target: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const sourceCtrl = control.get(source);
      const targetCtrl = control.get(target);

      console.log(sourceCtrl?.value. targetCtrl?.value);

      return sourceCtrl && targetCtrl && sourceCtrl.value !== targetCtrl.value
        ? { mismatch: true }
        : null;
    };
  }
}
