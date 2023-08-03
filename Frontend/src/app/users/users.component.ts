import { ProjectsService } from './../_services/projects.service';
import { Component, OnInit, OnDestroy, Inject, AfterViewInit } from "@angular/core";
import { User } from "../_models/user";
import { Subscription } from "rxjs";
import { AuthenticationService } from "../_services/authentication.service";
import { UserService } from "../_services/user.service";
import { first, timeout } from "rxjs/operators";
import { GridOptions } from "ag-grid-community";
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { AlertService } from '../_services/alert.service';

@Component({
  selector: "micro-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.css"],
})
export class UsersComponent implements OnInit, OnDestroy, AfterViewInit {

  currentUser: User;
  currentUserSubscription: Subscription;
  editDialogRef;
  deleteDialogRef;
  users = [];
  defaultColDef = {
    autoHeight: true,
    sortable: true,
    resizable: false,
    width: 150,

  };

  columnDefs = [
    {
      field: "id",
      headerName: "الرقم",
      width: "120",
      floatingFilter: true,
      filter: "agTextColumnFilter",
      cellStyle: { textAlign: 'center' },
    },
    {
      field: "username",
      headerName: "الاسم",
      minWidth: "200",
      floatingFilter: true,
      filter: "agTextColumnFilter",
      cellStyle: { textAlign: 'center' },
    },
    {
      field: "usertype",
      headerName: "نوع المستخدم",
      minWidth: "120",
      floatingFilter: true,
      filter: "agTextColumnFilter",
      cellStyle: { textAlign: 'center' },
    },
    {
      field: "projects",
      headerName: "المشاريع",
      minWidth: "500",
      width: "500",
      floatingFilter: true,
      filter: "agTextColumnFilter",
      cellRenderer: (params) => {
        let projects = "";
        if (params.value && params.value.length && params.value.length > 0) {
          params.value.forEach((element, i) => {
            projects += `<li>${element.nameAR}</li>`;
          });
        }
        return projects;
      },
    },
    {
      field: "edit",
      headerName: "تعديل",
      minWidth: "70",
      width: "70",
      cellStyle: { textAlign: 'center' },
      floatingFilter: false,
      filter: false,
      cellRenderer: (params) => {

        return `<a class="fa fa-pencil" style="color:white;" ></a>`
      },
    },
    {
      field: "delete",
      headerName: "حذف",
      minWidth: "70",
      width: "70",
      cellStyle: { textAlign: 'center' },
      floatingFilter: false,
      filter: false,
      cellRenderer: (params) => {

        return `<a class="fa fa-trash-o" style="color:red;" ></a>`
      },
    },
  ];

  rowData: any[];
  gridApi: any;
  gridColumnApi: any;
  gridOptions: GridOptions;

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    public dialog: MatDialog,
    private router: Router,
    private projectsService: ProjectsService
  ) {

    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
    this.loadAllUsers();
  }
  ngOnInit() {

  }

  ngAfterViewInit(): void {
  }

  openEditDialog(data) {
    this.editDialogRef = this.editDialogRef ? this.editDialogRef : this.dialog.open(EditUsersDialog,
      {
        data: {
          userData: data,
          currentUser: JSON.parse(JSON.stringify((this.currentUser)))
        }
      });

    this.editDialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`, data);
      setTimeout(() => {
        this.loadAllUsers();
      }, 300);

      this.editDialogRef = undefined;
    });
  }

  openDeleteDialog(data) {
    this.deleteDialogRef = this.deleteDialogRef ? this.deleteDialogRef : this.dialog.open(DeleteUsersDialog,
      {
        data: {
          userData: data
        }
      });

    this.deleteDialogRef.afterClosed().subscribe(result => {
      this.deleteDialogRef = undefined;
      this.loadAllUsers();
      console.log(`Dialog result: ${result}`, data);
    });
  }
  onCellClicked(params) {
    if (params.event && params.event.path && params.event.path[0]['className']) {
      if (params.event.path[0]['className'] === 'fa fa-pencil') {
        this.openEditDialog(params.data);
      } else if (params.event.path[0]['className'] === 'fa fa-trash-o') {
        this.openDeleteDialog(params.data);
      }
    }
  }

  onColumnResized(params) {
    // params.api.resetRowHeights();
    /*  var allColumnIds = [];
     this.gridColumnApi.getAllColumns().forEach(function (column) {
       allColumnIds.push(column.colId);
     });
   
     this.gridColumnApi.autoSizeColumns(allColumnIds, false); */
  }

  onColumnVisible(params) {
    params.api.resetRowHeights();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }



  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.currentUserSubscription.unsubscribe();
  }

  deleteUser(id: number) {
    this.userService
      .delete(id)
      .subscribe(() => {
        this.loadAllUsers();
      });
  }

  private loadAllUsers() {
    this.userService
      .getAllUsers()
      .subscribe((users: any) => {
        this.users = users.data;
        this.users.forEach(e => {
          e.projects = JSON.parse(e.projects);
        });
        this.rowData = this.users;
      });
  }

  getSelectedRows() {
    const selectedNodes = this.gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    const selectedDataStringPresentation = selectedData
      .map((node) => `${node.make} ${node.model}`)
      .join(", ");

    alert(`Selected nodes: ${selectedDataStringPresentation}`);
  }
}


@Component({
  selector: 'micro-edit-users-dialog',
  templateUrl: 'edit-users-dialog.html',
  styleUrls: ['users.component.css']
})
export class EditUsersDialog implements OnInit {

  projectsChecklist = [];
  projectListFullData = [];
  projectsList = [];
  allSelected = false;
  selectedProjects = [];

  isAdmin = false;
  isClient = false;
  currentU;

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
  constructor(@Inject(MAT_DIALOG_DATA) public userData,
    private userService: UserService,
    private projectsService: ProjectsService,
    private router: Router,
    private alertService: AlertService,
  ) {
    this.currentU = JSON.parse(JSON.stringify(this.userData.currentUser));
    this.userData = JSON.parse(JSON.stringify(this.userData.userData));
    this.isAdmin = this.userData.usertype === 'admin' ? true : false;
    this.isClient = !this.isAdmin;
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
    let user = this.userData;
    let currEdited = user.id === this.currentU.id;
  
    user['password'] = (<HTMLInputElement>document.getElementById("passwordInputEditor")).value;

    if (user.password === '') {
      this.alertService.error('من فضلك أدخل كلمة السر');
      return;
    }

    if (user.username === (<HTMLInputElement>document.getElementById("usernameInputEditor")).value) {
      user.username = (<HTMLInputElement>document.getElementById("usernameInputEditor")).value;
      user.usertype = this.isClient ? 'client' : 'admin';
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
            if (currEdited) {
              delete user.password;
              user.projects = projects;
              localStorage.setItem('microfilmUser', JSON.stringify(user));
              location.reload();
            }

            this.alertService.success("تم التعديل بنجاح", false);
          },
          (error) => {
            this.alertService.error("حدث خطأ أثناء التعديل");
          }
        );

    } else {
      user.username = (<HTMLInputElement>document.getElementById("usernameInputEditor")).value;
      this.userService.getAllUsers().subscribe((data) => {
        if (data.data.filter(e => e.username === user.username && user.username !== this.currentU.username).length > 0) {
          this.alertService.error("المستخدم موجود بالفعل", true);
        } else {
          user.usertype = this.isClient ? 'client' : 'admin';
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
                if (currEdited) {
                  delete user.password;
                  user.projects = projects;
                  localStorage.setItem('microfilmUser', JSON.stringify(user));
                  location.reload();
                }

                this.alertService.success("تم التعديل بنجاح", false);
              },
              (error) => {
                this.alertService.error("حدث خطأ أثناء التعديل");
              }
            );
        }
      });


    }
  }
}
@Component({
  selector: 'micro-delete-users-dialog',
  templateUrl: 'delete-users-dialog.html',
  styleUrls: ['users.component.css']
})
export class DeleteUsersDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public userData, private userService: UserService, private router: Router,
    private alertService: AlertService,) { }


  deleteUser() {
    let currEdited = JSON.parse(localStorage.getItem('microfilmUser')).id === this.userData.userData.id;
    if (currEdited) {
      this.alertService.error("لا يمكنك حذف المستخدم الحالي");
      return;
    }
    this.userService
      .delete(this.userData.userData.id)
      .subscribe(
        (data) => {
          this.alertService.success("تم الحذف بنجاح", false);
        },
        (error) => {
          this.alertService.error("حدث خطأ أثناء الحذف");
        }
      );
  }
}