import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { FbAuthResponse, User } from 'src/app/shared/interfaces';

@Injectable({ providedIn: 'root' })
export class AuthService {

  public error$: Subject<string> = new Subject<string>();

  get token(): string {
    const expiresDate = new Date(localStorage.getItem('fb-token-exp'));
    if(new Date() > expiresDate){
      this.logout();
      return null;
    }
    return localStorage.getItem('fb-token');
  };

  constructor(
    private http: HttpClient
  ){}

  login(user: User): Observable<any> {
    user.returnSecureToken = true;
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user)
      .pipe(
        tap(this.setToken),
        catchError(this.handleError.bind(this))
      );
  };

  logout(){
    this.setToken(null);
  };

  isAuthenticated(): boolean {
    return !!this.token;
  };

  private setToken(response: FbAuthResponse | null) {
    if(response) {
      const expiresDate = new Date(new Date().getTime() + +response.expiresIn*1000);
      localStorage.setItem('fb-token', response.idToken);
      localStorage.setItem('fb-token-exp', expiresDate.toString());
    } else {
      localStorage.clear();
    }
  };

  private handleError(error: HttpErrorResponse) {
    const {message} = error.error.error;
    switch (message) {
      case 'EMAIL_NOT_FOUND':
        this.error$.next('Email not exist');
        break;
      case 'INVALID_EMAIL':
        this.error$.next('Wrong email');
        break;
      case 'INVALID_PASSWORD':
        this.error$.next('Wrong password');
        break;
      default:
        break;
    };
    return throwError(error);
  };

};
