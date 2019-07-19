import { Component, OnInit } from '@angular/core';
import { Project } from '../../../interfaces/project/project';
import { SharedProjectService } from '../../../services/shared-project/shared-project.service';
import { ProjectApiRequesterService } from '../../../services/project-api-requester/project-api-requester.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})

export class ProjectsComponent implements OnInit {
  projects: Project[] = null;
  selected: number = 0;
  loading: boolean = false;

  hide: boolean = true;

  constructor(private sharedProjectService: SharedProjectService,
      private projectApiRequesterService: ProjectApiRequesterService) {

  }

  ngOnInit() {
    this.projects = this.sharedProjectService.getProjects();
    if (this.projects === null) {
      this.onRefreshProjectsClick();
    }
  }

  setProject(project: Project) {
    this.sharedProjectService.setCurrentProject(project);
  }

  onRefreshProjectsClick() {
    this.loading = true;
    this.projects = null;
    this.projectApiRequesterService.getProjectsBasic().subscribe(
      (projects: Project[]) => {
        this.sharedProjectService.setProjects(projects);
        this.projects = this.sharedProjectService.getProjects();
        this.loading = false;
      },
      error => {
        console.log("Error");
        this.loading = true;
      }
    );
  }

  // public innerWidth: any;
  // public collapse: boolean;

  // public projectData = [];
  // public projectDataBackup = [];
  // whitelist: string[] = [];
  // blacklist: string[] = [];
  // whitelistword = '';
  // blacklistword = '';

  // editMode: boolean;
  // dataMode: boolean;

  // public twitterResults: [];
  // public sentiments: [];

  // constructor(private router: Router, private requester: ProjectApiRequesterService) { }

  // ngOnInit() {
  //   this.innerWidth = window.innerWidth;
  //   if(this.innerWidth > 1200) {
  //     this.collapse = false;
  //   }

  //   if(this.innerWidth < 1200) {
  //     this.collapse= true;
  //   }

  //   this.requester.getProjects().subscribe((res: Projects[]) => {
  //     this.projectData = JSON.parse(JSON.stringify(res));
  //     this.projectDataBackup = JSON.parse(JSON.stringify(res));
  //   });

  //   this.editMode = false;
  //   this.dataMode = false;
  // }

  // @HostListener('window:resize', ['$event']) onResize(event) { 
  //   this.innerWidth = window.innerWidth;
  //   if(this.innerWidth > 1200) {
  //     this.collapse = false;
  //   }

  //   if(this.innerWidth < 1200) {
  //     this.collapse= true;
  //   }
  // }

  // addWhitelistWord() {
  //   const word = this.whitelistword.trim();

  //   if (word === '') {
  //     this.whitelistword = '';
  //     return;
  //   }

  //   this.whitelist.push(this.whitelistword);
  //   this.whitelistword = '';
  // }

  // addBlacklistWord() {
  //   const word = this.blacklistword.trim();

  //   if (word === '') {
  //     this.blacklistword = '';
  //     return;
  //   }

  //   this.blacklist.push(this.blacklistword);
  //   this.blacklistword = '';
  // }

1

  // changeMode(form: NgForm, id: number) {
  //   if (this.editMode) {
  //     this.update(form, id);
  //     this.editMode = false;
  //   } else {
  //     this.editMode = true;
  //   }
  // }

  // assignArrays(index: number) {
  //   this.whitelist = this.projectData[index].whitelist;
  //   this.blacklist = this.projectData[index].blacklist;
  // }

  // reset(form: NgForm) {
  //   this.editMode = false;
  //   form.reset();

  //   this.projectData = JSON.parse(JSON.stringify(this.projectDataBackup));
  // }

  // resetData(form: NgForm) {
  //   if (this.editMode === true) {
  //     this.projectData = JSON.parse(JSON.stringify(this.projectDataBackup));
  //   }

  //   this.editMode = false;
  // }

  // update(form: NgForm, id: number) {
  //   let pos = 0;
  //   for (let i = 0; i < this.projectData.length; i++) {
  //     if (this.projectData[i]._id === id) {
  //       pos = i;
  //     }
  //   }

  //   const values = form.value;

  //   this.projectDataBackup[pos].project_name = values.name;
  //   this.projectDataBackup[pos].source = values.source;
  //   this.projectDataBackup[pos].trackTime = values.track;
  //   this.projectDataBackup[pos].whitelist = this.whitelist;
  //   this.projectDataBackup[pos].blacklist = this.blacklist;

  //   this.reset(form);
  //   this.requester.updateProject(id, values.name, values.source, values.track, this.whitelist, this.blacklist).subscribe((res: any) => {
  //   });
  // }

  // remove(form: NgForm, id: number) {
  //   this.requester.deleteProject(id).subscribe((res: any) => {
  //   });
  //   this.router.navigate(['/']);
  // }

  // start(id: number) {
  //   console.log(id);
  //   this.requester.start(id).subscribe((res: any) => {
  //     if(res != undefined){
  //       let json = JSON.parse(res);
        
  //       this.twitterResults = json.data[0];
  //       this.sentiments = json.data[1]['sentiments'];
  //       this.dataMode = true;
  //     }
  //   });
  // }

  // close() {
  //   this.dataMode = false;
  // }
}
