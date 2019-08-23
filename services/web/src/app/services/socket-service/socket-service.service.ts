import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import * as socketIo from 'socket.io-client';

const SERVER_URL = 'http://localhost:3005';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket;

  public initSocket(): void {
      this.socket = socketIo(SERVER_URL);
  }

  // public send(message: Message): void {
  //     this.socket.emit('message', message);
  // }

  public onMessage(): Observable<any> {
      return new Observable<any>(observer => {
          this.socket.on('tweet', (data: any) => observer.next(data));
      });
  }

  public onEvent(event: Event): Observable<any> {
      return new Observable<Event>(observer => {
          this.socket.on(event, () => observer.next());
      });
  }
}