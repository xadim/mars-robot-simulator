import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DatasharingService {
  public robotCurrentPosition: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  constructor() {}
}
