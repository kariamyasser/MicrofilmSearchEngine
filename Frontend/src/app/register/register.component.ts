import { ProjectsService } from './../_services/projects.service';
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";

import { AlertService, UserService, AuthenticationService } from "../_services";

@Component({
  selector: "micro-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  projectsChecklist = [];
  projectListFullData = [];
  projectsList = [];
  allSelected = false;
  selectedProjects = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService,
    private projectsService: ProjectsService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(["/"]);
    }
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", [Validators.required]],
      usertype: [""],
      projects: [""],
    });

    this.projectsService.loadAllProjectsNames().subscribe(projects => {
      this.projectListFullData = projects.data;


      this.projectsChecklist.push({
        id: 0,
        label: "الكل",
        isChecked: false,
      });
      this.projectListFullData.forEach((element, i) => {
        this.projectsChecklist.push({
          id: i + 1,
          label: element.nameAR,
          title: element.nameENG,
          isChecked: false,
        });
      });
    });

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

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.registerForm);

    this.userService.getAllUsers().subscribe((data) => {




      if (data.data.filter(e => e.username === this.registerForm.value.username).length > 0) {
        this.alertService.error("المستخدم موجود بالفعل");

      } else {


          this.registerForm.value.usertype = 'client';
        

        this.registerForm.value.projects = [];
        this.selectedProjects.forEach(e => {

          this.projectListFullData.forEach(element => {
            if (e === element.nameENG) {
              this.registerForm.value.projects.push({
                nameENG: element.nameENG,
                nameAR: element.nameAR
              });
            }
          });
        });

        this.registerForm.value.projects = JSON.stringify(this.registerForm.value.projects);
        // stop here if form is invalid
        if (this.registerForm.invalid) {
          return;
        }
        this.loading = true;
        this.userService
          .register(this.registerForm.value)
          .subscribe(
            (data) => {
              this.alertService.success("تم التسجيل بنجاح", true);
              this.router.navigate(["/login"]);
            },
            (error) => {
              this.alertService.error("حدث خطأ أثناء التسجيل");
              this.loading = false;
            }
          );

      }

    },
      (error) => {
        this.alertService.error("حدث خطأ أثناء التسجيل");
        this.loading = false;
      }
    );

  }
}
