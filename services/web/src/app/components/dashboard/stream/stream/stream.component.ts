import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../../../services/socket-service/socket-service.service';
import { Data } from '../../../../interfaces/project/project';

@Component({
  selector: 'app-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.css']
})
export class StreamComponent implements OnInit {

  ioConnection: any = null;
  data: Data[] = [];

  constructor(private socketService: SocketService) {}

  ngOnInit() {
    this.socketService.initSocket();

    this.ioConnection = this.socketService.onMessage().subscribe(
      (message: Data) => {
        // this.project.data.push(message);
        // this.project.data = [...this.project.data];
        this.data.push(message);
        
        setTimeout(
          function() {
            this.removeTop();
          },
          2000
        );
      }
    );
  }

  removeTop() {
    this.data.shift();
  }

}
