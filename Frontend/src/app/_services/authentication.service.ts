import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../_models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('microfilmUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string) {
        return this.http.get<any>(`/login/`+ username +'/'+  password)
            .pipe(map(user => {
                if (user) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    user.data[0].projects = JSON.parse(user.data[0].projects);
                    localStorage.setItem('microfilmUser', JSON.stringify(user.data[0]));
                    this.currentUserSubject.next(user.data[0]);
                }
                return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('microfilmUser');
        this.currentUserSubject.next(null);
    }
}