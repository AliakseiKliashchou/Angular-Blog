import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { User } from 'src/app/shared/interfaces';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  form: FormGroup;
  submitted: boolean = false;
  message: string = '';

  constructor(
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute

  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe( (params: Params) => {
      if(params['loginAgain']){
        this.message = 'Please, login'
      } else if (params['authFailed']) {
        this.message = 'Session is over. Enter credentials'
      }
    });
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.email, Validators.required]),
      password: new FormControl(null, [Validators.minLength(6), Validators.required])
    });
  }

  submit(): void {
    if(this.form.invalid){
      return;
    };

    this.submitted = true;

    const user: User = {
      email: this.form.value.email,
      password: this.form.value.password
    }

    this.authService.login(user).subscribe(
      next => {
        this.form.reset();
        this.router.navigate(['/admin', 'dashboard']);
        this.submitted = false;
      }),
      error => {
        this.submitted = false;
      }

  };

}
