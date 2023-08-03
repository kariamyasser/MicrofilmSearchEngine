import { Component, OnInit, Input, Inject } from '@angular/core';
import { User } from '../_models';
import { Subscription } from 'rxjs';
import { GridOptions } from 'ag-grid-community';
import { AlertService, AuthenticationService, UserService } from '../_services';
import { first } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectsService } from '../_services/projects.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'micro-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  @Input() projectName;
  currentUser: User;
  currentUserSubscription: Subscription;
  users: User[] = [];
  totalNumberOfViews;
  defaultColDef = {
    width: 120,
    sortable: true,
    filter: true,
    floatingFilter: true,
    resizable: false,
  };

  columnDefs = [
    {
      field: "FILM_TYPE",
      headerName: "نوع الفيلم",
      width: "120",


    },
    {
      field: "FILM_NUMBER",
      headerName: "رقم الفيلم",
      width: "120",

    },
    {
      field: "PORTFOLIO",
      headerName: "رقم الحافظة",
      width: "130",

    },
    {
      field: "view",
      headerName: "عرض",
      minWidth: "70",
      width: "70",
      cellStyle: { textAlign: 'center' },
      floatingFilter: false,
      filter: false,
      cellRenderer: (params) => {

        return `<a class="fa fa-eye" style="color:green;" ></a>`
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
  ];

  
  rowData: any[];
  gridApi: any;
  gridColumnApi: any;
  gridOptions: GridOptions;
  projectFields: any;
  projectData: any;
  tempColDefs;
  editDialogRef: any;
  constructor(
    private authenticationService: AuthenticationService,
    private projectsService: ProjectsService,
    private userService: UserService,
    private router: Router,
    public dialog: MatDialog,
    private route: ActivatedRoute
  ) {



      this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
          this.currentUser = user;
      });
      route.params.subscribe(
       (params) => {
         console.log("params.get('projectName')", params['projectName']);
         this.currentUser.projects.forEach((e: any) => {

          if(e.nameENG === params['projectName']){
            this.projectName = {

              nameENG: params['projectName'],
              nameAR: e.nameAR
            }
          }
         });
         
       });

       this.projectFields = this.projectsService.loadProjectFields(this.projectName.nameENG).subscribe(fields => {
        this.tempColDefs=fields.data;
        this.updateColumns(this.tempColDefs);
        this.projectFields = this.projectsService.loadAllData(this.projectName.nameENG).subscribe(data => {
          this.rowData = data.data;
          this.totalNumberOfViews = data.data.length;
        });
      });
       
  }
  onsuccess(data){
    console.log(data);
  }

  updateColumns(data){
    let tempFields = [];
    data.forEach((element,i) => {
      if(!this.columnDefs.find(o => o.field === element.FIELD_NAME_ENG)){

        tempFields.push(element);
      }      
    });
    if(tempFields.length > 0){
      let size = (600 / tempFields.length).toString();
      tempFields.forEach(element => {
        let x = {
          field: element.FIELD_NAME_ENG,
          headerName:  element.FIELD_NAME_AR,
          width: size,
        };
        this.columnDefs.push(x);
           
      });
    }
    setTimeout(() => {
      this.gridApi.setColumnDefs(this.columnDefs);
    }, 300);
    
    
    console.log(data);
  }
  onCellClicked(params){
    if (params.event && params.event.path && params.event.path[0]['className'])
    {
      if(params.event.path[0]['className'] === 'fa fa-eye'){
        console.log(params.data, "VIEW");
        let url = '/project/Images/'+this.projectName.nameENG+'/Scan_Tree/'+params.data.FILM_TYPE+'/'+params.data.FILM_NUMBER+'/Film/'+params.data.PORTFOLIO;
        this.router.navigate([url]);
      } else if (params.event.path[0]['className'] === 'fa fa-pencil'){
        this.openEditDialog(params.data)
        console.log(params.data, "EDIT");
      }
    }
  }


  openEditDialog(data) {
    this.editDialogRef = this.editDialogRef ? this.editDialogRef : this.dialog.open(EditProjectDialog,
      {
        data: {
          projectName: this.projectName.nameENG,
          fields: this.tempColDefs,
          data: data,
        }
      });

    this.editDialogRef.afterClosed().subscribe(result => {
      this.projectFields = this.projectsService.loadAllData(this.projectName.nameENG).subscribe(data => {
        this.rowData = data.data;
        this.totalNumberOfViews = data.data.length;
      });
      this.editDialogRef = undefined;
    });
  }

  onColumnResized(params) {
    // params.api.resetRowHeights();
    /*  var allColumnIds = [];
     this.gridColumnApi.getAllColumns().forEach(function (column) {
       allColumnIds.push(column.colId);
     });
   
     this.gridColumnApi.autoSizeColumns(allColumnIds, false); */
   }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;


  }

  ngOnInit() {
    
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.currentUserSubscription.unsubscribe();
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
  selector: 'micro-edit-project-dialog',
  templateUrl: 'edit-project-dialog.html',
  styleUrls: ['project.component.css']
})
export class EditProjectDialog {
  fields = [];
  proName: any;
  fieldsData: any;
  constructor(@Inject(MAT_DIALOG_DATA) public projectData, private projectsService: ProjectsService, private router: Router,
    private alertService: AlertService,) {
      this.projectData.fields.forEach((element, i) => {
        element.FIELD_NAME_ENG !== "FILM_NUMBER" &&
        element.FIELD_NAME_ENG !== "FILM_TYPE" && 
        element.FIELD_NAME_ENG !== "PORTFOLIO_ID" ? this.fields.push(element): null;
        
      });
      this.proName = this.projectData.projectName;
      this.fieldsData = this.projectData.data;
     }

     editProject(){
       let tempFields = [];
       let fieldsData = [];
       let sendingFields = {};

      this.fields.forEach(element => {
        tempFields.push(element.FIELD_NAME_ENG);
        fieldsData.push({
          [element.FIELD_NAME_ENG] : (<HTMLInputElement>document.getElementById(element.FIELD_NAME_ENG+"-editField")).value
        });
        sendingFields[element.FIELD_NAME_ENG] = (<HTMLInputElement>document.getElementById(element.FIELD_NAME_ENG+"-editField")).value;
      });
       let project = {
         id: this.fieldsData.ID,
         fields: tempFields,
         data: sendingFields
       }
       console.log(project);
       this.projectsService
     .update(this.proName,project)
     .subscribe(
       (data) => {
         this.alertService.success("تم التعديل بنجاح", false);
       },
       (error) => {
         this.alertService.error("حدث خطأ أثناء التعديل");
       }
     );
     }
     


}
