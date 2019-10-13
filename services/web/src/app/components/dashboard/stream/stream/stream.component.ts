import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../../../services/socket-service/socket-service.service';
import { Data } from '../../../../interfaces/project/project';
import { interval } from 'rxjs';

@Component({
  selector: 'app-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.css']
})
export class StreamComponent implements OnInit {

  ioConnection: any = null;
  datas: Data[] = [];
  totalData: number = 0;

  constructor(private socketService: SocketService) {}

  ngOnInit() {
    console.log("Init");
    this.socketService.initSocket();

    this.ioConnection = this.socketService.onMessage().subscribe(
      (message: Data) => {
        // this.project.data.push(message);
        // this.project.data = [...this.project.data];
        console.log(message);
        this.datas.unshift(message);
        ++this.totalData;
      }
    );
  }

}
