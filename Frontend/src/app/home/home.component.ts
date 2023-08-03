import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { User } from '../_models';
import { UserService, AuthenticationService } from '../_services';
import { Router } from '@angular/router';

@Component({
    selector: "micro-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.css"],
  })
export class HomeComponent implements OnInit, OnDestroy {
    currentUser: User;
    currentUserSubscription: Subscription;
    users: User[] = [];
    projects = [];
    currentProject = '';

    constructor(
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private router: Router
    ) {
        this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
            this.currentUser = user;
            this.projects = this.currentUser.projects;
            this.currentProject = this.projects[0]? this.projects[0].nameENG : '';
        });
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.currentUserSubscription.unsubscribe();
    }

    onProjectSelect(event){ 
        this.currentProject = event.target.value.nameENG;
    }
    goToProject(){
        console.log(this.currentProject);
        this.router.navigate(['/project', this.currentProject]);
    }
}