import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../_models';
import { AuthenticationService, UserService } from '../_services';
import { ProjectsService } from '../_services/projects.service';
import  printJS  from 'print-js'
import  jsPDF  from "jspdf";

@Component({
  selector: 'micro-projectView',
  templateUrl: './projectView.component.html',
  styleUrls: ['./projectView.component.css']
})
export class ProjectViewComponent implements OnInit, OnDestroy {

  projectName;
  photopath;
  currentUser: User;
  currentUserSubscription: Subscription;
  imageList = [];
  shownImages = [];
  constructor(private authenticationService: AuthenticationService,
    private projectsService: ProjectsService,
    private userService: UserService,
    private route: ActivatedRoute) {

      

      this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
        this.currentUser = user;
    });

    route.params.subscribe(
      (params) => {

        this.photopath =   "/Scan_Tree/"+params['filmType']+"/"+params['filmNumber']+"/Film/"+params['portfolio'];

        this.currentUser.projects.forEach((e: any) => {

         if(e.nameENG === params['projectName']){
           this.projectName = {

             nameENG: params['projectName'],
             nameAR: e.nameAR
           }
         }
        });
        projectsService.getProjectImages( this.projectName.nameENG,this.photopath).subscribe(data => {

          data.forEach(element => {
            this.imageList.push({
              imgName: element,
              selected: false,
              srcPath: "/images/"+this.projectName.nameENG+this.photopath+"/"+element
            });
            this.shownImages.push({
              imgName: element,
              selected: false,
              srcPath: "/images/"+this.projectName.nameENG+this.photopath+"/"+element
            });
          });
        });
      });


   }

  ngOnInit() {
  }


saveImages(){
  this.imageList.forEach(element => {
    if(element.selected === true){
      this.downloadBlob(element)
    }
  });
}

downloadBlob(image) {
  // Create an object URL for the blob object
  const url = image.srcPath;
  
  // Create a new anchor element
  const a = document.createElement('a');
  
  // Set the href and download attributes for the anchor element
  // You can optionally set other attributes like `title`, etc
  // Especially, if the anchor element will be attached to the DOM
  a.href = url;
  a.download = image.imgName;
  
  // Click handler that releases the object URL after the element has been clicked
  // This is required for one-off downloads of the blob content
  const clickHandler = () => {
    setTimeout(() => {
      URL.revokeObjectURL(url);
      removeEventListener('click', clickHandler);
    }, 150);
  };
  
  // Add the click event listener on the anchor element
  // Comment out this line if you don't want a one-off download of the blob content
  a.addEventListener('click', clickHandler, false);
  
  // Programmatically trigger a click on the anchor element
  // Useful if you want the download to happen automatically
  // Without attaching the anchor element to the DOM
  // Comment out this line if you don't want an automatic download of the blob content
  a.click();
  
  // Return the anchor element
  // Useful if you want a reference to the element
  // in order to attach it to the DOM or use it in some other way
  return a;
}

search(val){

  if(val === ''){
    this.shownImages = this.imageList;
    
  } else {
    this.shownImages = [];
     this.imageList.forEach(element => {
    if(element.imgName.includes(val)){
      this.shownImages.push(element);
    }
  });

  }

 
}


createPDF(selectedImages) {
  var doc = new jsPDF('p', 'mm', 'a4');
  let len = selectedImages.length;
  let proName = this.projectName.nameAR;
  let num = 1;
  let baseImages = [];
  selectedImages.forEach((element, i)  => {
    this.imgToBase64(element.srcPath,  function(base64) {
      baseImages.push({
        id: i,
        img: base64
      });
       if(num ===len){
        baseImages.sort((a, b) => (a.id > b.id) ? 1 : -1);
        baseImages.forEach((img64, loc) => {
          doc.addImage(img64.img, 'JPEG', 10, 10, 190,277);
          if(loc < len - 1){
            doc.addPage();
          }
        });
        doc.save(proName);
      } else {
        num = num+1;
      }
  });
});
}


imgToBase64(url, callback ) {
 var imgVariable;
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'blob';
  xhr.onload = function() {
      var reader = new FileReader();
      reader.onloadend = function() {
    imgVariable = reader.result.toString().replace('text/xml', 'image/jpeg');
          callback(imgVariable);
      };
      reader.readAsDataURL(xhr.response);
  };
  xhr.open('GET', url);
  xhr.send();
};

saveAsPDF(){
  let mulImages  = [];
  this.imageList.forEach(element => {
    if(element.selected === true){
      mulImages.push(element);
    }
  });
  if(mulImages.length > 0){
    this.createPDF(mulImages);
  } 
}
printImages(){
  let mulImages  = [];

  this.imageList.forEach(element => {
    if(element.selected === true){
      mulImages.push(element.srcPath);
    }
  });
  if(mulImages.length > 0){
    printJS({
      printable: mulImages,
      type: 'image',
     });
  } 

}

printOneImage(image){
  var URL = image.srcPath;

  var W = window.open(URL);

  W.window.print();
}



selectAllImages(){
  this.imageList.forEach(element => {
    element.selected = true;
  });

}
deselectAllImages(){
  this.imageList.forEach(element => {
    element.selected = false;
  });

}


  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.currentUserSubscription.unsubscribe();
  }


}
