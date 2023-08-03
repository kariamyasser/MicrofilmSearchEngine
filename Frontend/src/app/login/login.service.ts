import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http/http';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

constructor(private http : HttpClient) { }


login (req): Observable<any> {
  let url = 'login/' + req.username + '/' + req.password; 
  return this.http.post(url,{});
}
}
