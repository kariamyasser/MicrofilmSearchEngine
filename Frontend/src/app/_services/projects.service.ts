import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

constructor(private http: HttpClient) { }

loadProjectFields(projectName){
  return this.http.get<any>(`/api/project/`+projectName+`/fields`); 
}

loadAllData(projectName) {
  return this.http.get<any>(`/api/project/`+projectName+`/data`);
}

loadAllProjectsNames() {
  return this.http.get<any>(`/api/projectNames`);
}
getProjectImages(projectName,photopath){
  return this.http.get<any>(`/images/projectImages/`+projectName+photopath);
}

update(projectName, project) {
  return this.http.put(`/api/update/project/` + projectName , project);
}

}


