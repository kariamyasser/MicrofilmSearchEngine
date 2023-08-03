import { CUSTOM_ELEMENTS_SCHEMA, NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule }    from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent }  from './app.component';
import { routing }        from './app.routing';
import { AgGridModule } from 'ag-grid-angular';
import { AlertComponent } from './alert';
import { ErrorInterceptor } from './_helpers';
import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { UsersComponent, EditUsersDialog, DeleteUsersDialog } from './users/users.component';
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';
import { EditProjectDialog, ProjectComponent } from './project/project.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS} from '@angular/material';
import { ProjectViewComponent } from './projectView/projectView.component';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        AgGridModule.withComponents([]),
        BrowserAnimationsModule,
        routing,
        MatDialogModule,
        MatButtonModule,
        CommonModule 
    ],
    declarations: [						
        AppComponent,
        AlertComponent,
        HomeComponent,
        LoginComponent,
        RegisterComponent,
        UsersComponent,
        ProfileComponent,
        SettingsComponent,
        ProjectComponent,
        EditUsersDialog,
        DeleteUsersDialog,
        EditProjectDialog,
      ProjectViewComponent,
      
   ],
   entryComponents: [
    EditUsersDialog,
    DeleteUsersDialog,
    EditProjectDialog
  ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}},
        // provider used to create fake backend
    ],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class AppModule { }