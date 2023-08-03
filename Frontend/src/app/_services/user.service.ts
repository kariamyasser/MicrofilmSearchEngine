import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAllUsers() {
        return this.http.get<any>(`/api/users/all`);
    }
    getById(id: number) {
        return this.http.get<any>(`/api/users/` + id);
    }
    register(user) {
        return this.http.post(`/api/users`, user);
    }
    update(user) {
        return this.http.put(`/api/update/user/single` , user);
    }
    delete(id: number) {
        return this.http.delete(`/api/users/` + id);
    }
}