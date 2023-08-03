import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../_models';
import { Subscription } from 'rxjs';
import { AlertService, AuthenticationService, UserService } from '../_services';
import { ProjectsService } from '../_services/projects.service';
import { Router } from '@angular/router';

@Component({
  selector: 'micro-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

  currentUser: User;
  currentUserSubscription: Subscription;
  users: User[] = [];
  loading;



  
  projectsChecklist = [];
  projectListFullData = [];
  projectsList = [];
  allSelected = false;
  selectedProjects = [];

  isAdmin = false;
  isClient = false;
  userData;


  constructor(
      private authenticationService: AuthenticationService,
      private userService: UserService,
      private projectsService: ProjectsService,
      private router: Router,
      private alertService: AlertService,
  ) {
      this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
          this.currentUser = user;

          this.userData =  JSON.parse(JSON.stringify(this.currentUser));
          this.isAdmin = this.userData.usertype === 'admin' ? true : false;
          this.isClient = !this.isAdmin;
      });
  }
  ngOnInit() {
    this.projectsService.loadAllProjectsNames().subscribe(projects => {
      this.projectListFullData = projects.data;
  
  
      this.projectsChecklist.push({
        id: 0,
        label: "الكل",
        isChecked: false,
      });
      let currentUser = this.userData;
      let incremental = 0;
      this.projectListFullData.forEach((element, i) => {
        let checked = currentUser.projects.some(e => e.nameENG === element.nameENG);
        checked ? this.selectedProjects.push(element.nameENG) : null;
        incremental = checked ? incremental + 1 : incremental;
        this.projectsChecklist.push({
          id: i + 1,
          label: element.nameAR,
          title: element.nameENG,
          isChecked: checked,
        });
      });
      this.projectsChecklist[0].isChecked = incremental === this.projectListFullData.length ? true : false;
    });
  
  }
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.currentUserSubscription.unsubscribe();
}







changeSelection(id) {
  if (id === 0) {
    this.projectsChecklist[0].isChecked = !this.projectsChecklist[0]
      .isChecked;
    if (this.projectsChecklist[0].isChecked === false) {
      this.selectedProjects = [];
      this.projectsChecklist.forEach((element, i) => {
        this.projectsChecklist[i].isChecked = false;
      });
    } else {
      this.selectedProjects = [];

      this.projectsChecklist.forEach((element, i) => {
        if (i !== 0) {
          this.projectsChecklist[i].isChecked = true;
          this.selectedProjects.push(element.title);
        }
      });
    }
  } else {
    this.projectsChecklist.forEach((element, i) => {
      if (i === id) {
        this.projectsChecklist[i].isChecked = !this.projectsChecklist[i]
          .isChecked;

        if (this.projectsChecklist[i].isChecked === false) {

          if (this.projectsChecklist[0].isChecked === true) {
            this.projectsChecklist[0].isChecked = false;
          }

          let index = this.selectedProjects.indexOf(element.title);
          if (index > -1) {
            this.selectedProjects.splice(index, 1);
          }
        } else {
          let flag = true;
          this.projectsChecklist.forEach((element, i) => {
            if (element.isChecked === false && i !== 0) {
              flag = false;
            }
          });

          this.projectsChecklist[0].isChecked = flag === true ? true : this.projectsChecklist[0].isChecked;



          this.selectedProjects.push(element.title);
        }
      }
    });
  }
  console.log(this.selectedProjects);
}


editUser() {
  this.loading = true;


  let user = this.userData;
  user.username = (<HTMLInputElement>document.getElementById("usernameInputEditor")).value;
  user['password'] = (<HTMLInputElement>document.getElementById("passwordInputEditor")).value;
  user.usertype = this.isClient ? 'client' : 'admin';


  if (user.password === '') {
    this.alertService.error('من فضلك أدخل كلمة السر');
    this.loading = false;
    return;
  }
  this.userService.getAllUsers().subscribe((data) => {

    if (data.data.filter(e => e.username === user.username && user.username !== this.currentUser.username).length > 0) {
      this.alertService.error("المستخدم موجود بالفعل");
      this.loading = false;

    } else {

      let projects = [];
      this.selectedProjects.forEach((e, i) => {
    
        this.projectListFullData.forEach(element => {
          if (e === element.nameENG) {
            projects.push({
              nameENG: element.nameENG,
              nameAR: element.nameAR
            });
          }
        });
      });
      user.projects = JSON.stringify(projects);
      console.log('new User === ', user);
      this.userService
        .update(user)
        .subscribe(
          (data) => {
            this.loading = false;
            delete user.password;
            user.projects = projects;
            localStorage.setItem('microfilmUser',JSON.stringify(user));
            // location.reload();
            this.alertService.success("تم التعديل بنجاح", false);
          },
          (error) => {
            this.loading = false;
            this.alertService.error("حدث خطأ أثناء التعديل");
          }
        );
    
    


    }
  });
 
} 
}





