import { Component, OnInit, OnDestroy } from "@angular/core";
import { User } from "../_models";
import { Subscription } from "rxjs";
import { AuthenticationService, UserService } from "../_services";

@Component({
  selector: "micro-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.css"],
})
export class SettingsComponent implements OnInit, OnDestroy {
  currentUser: User;
  currentUserSubscription: Subscription;
  users: User[] = [];
  isError = false;
  loading= false;
  path = '';
  isSuccess
  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService
  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(
      (user) => {
        this.currentUser = user;
      }
    );
  }
  ngOnInit() {}
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.currentUserSubscription.unsubscribe();
  }

  submitPath(){
    this.loading= true;
    if(this.path === ''){
      this.isError = true;
    }
    else { 
      this.isSuccess = true;
      this.isError = false;
    }
    this.loading= false;

  }

  onDataEntered(e){
    this.isSuccess = false;
    this.path = e.target.value;
    if(this.path !== ''){
      this.isError = false;
    }
  }
}
