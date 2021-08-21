import { Injectable } from '@angular/core';
import { DatasharingService } from '../services/datasharing.service';

@Injectable({
  providedIn: 'root',
})
export class RobotService {
  _robotCurrentPosition: any = {};
  _unit: number = 74; // margin 0f 14 to place the object in the middle of the square
  _robot: number = 60;
  _platformMinusRobotSize: number = 296; // margin = 4px
  // tracer:
  _units = 5;

  constructor(private dataSharingSrv: DatasharingService) {}

  /***
   * Place the robot on the playground
   * @param xPosition
   * @param yPosition
   * @param facing
   */
  _setRobotPosition(xPosition: number, yPosition: number, facing: string) {
    this._robotCurrentPosition.xPosition = xPosition;
    this._robotCurrentPosition.yPosition = yPosition;
    this._robotCurrentPosition.facing = facing;
    this._robotCurrentPosition.xAxis =
      xPosition <= 0 ? 0 : xPosition * this._unit;
    this._robotCurrentPosition.yAxis =
      yPosition <= 0
        ? this._platformMinusRobotSize
        : this._platformMinusRobotSize - yPosition * this._unit; // 360 is the playground height, 60 is the robot size
    this._robotCurrentPosition.direction = this.getDirectionDegree(facing);
    this.dataSharingSrv.robotCurrentPosition.next(this._robotCurrentPosition);
  }

  getDirectionDegree(d: string) {
    let direction;
    switch (d) {
      case 'NORTH':
        direction = 0;
        break;

      case 'EAST':
        direction = 90;
        break;

      case 'SOUTH':
        direction = 180;
        break;

      case 'WEST':
        direction = 270;
        break;
    }
    return direction;
  }

  /***
   * Move one position inside table top
   *
   */
  move() {
    let facing = this._robotCurrentPosition.facing;
    switch (facing) {
      case 'NORTH':
        if (this._robotCurrentPosition.yPosition < this._units - 1) {
          this._robotCurrentPosition.yPosition += 1;
        }
        break;
      case 'SOUTH':
        if (this._robotCurrentPosition.yPosition > 0) {
          this._robotCurrentPosition.yPosition -= 1;
        }
        break;
      case 'EAST':
        if (this._robotCurrentPosition.xPosition < this._units - 1) {
          this._robotCurrentPosition.xPosition += 1;
        }
        break;
      case 'WEST':
        if (this._robotCurrentPosition.xPosition > 0) {
          this._robotCurrentPosition.xPosition -= 1;
        }
        break;
    }
    this._setRobotPosition(
      this._robotCurrentPosition.xPosition,
      this._robotCurrentPosition.yPosition,
      this._robotCurrentPosition.facing
    );
  }

  /***
   * change the facing 90degrees
   * @param newFacing
   */
  rotate(newFacing: string) {
    switch (this._robotCurrentPosition.facing) {
      case 'NORTH':
        this._robotCurrentPosition.facing =
          newFacing === 'LEFT' ? 'WEST' : 'EAST';
        break;
      case 'SOUTH':
        this._robotCurrentPosition.facing =
          newFacing === 'LEFT' ? 'EAST' : 'WEST';
        break;
      case 'EAST':
        this._robotCurrentPosition.facing =
          newFacing === 'LEFT' ? 'NORTH' : 'SOUTH';
        break;
      case 'WEST':
        this._robotCurrentPosition.facing =
          newFacing === 'LEFT' ? 'SOUTH' : 'NORTH';
        break;
    }
    this._robotCurrentPosition.direction = this.getDirectionDegree(
      this._robotCurrentPosition.facing
    );
    // this._robotCurrentPosition.direction =
    //   newFacing === 'LEFT'
    //     ? this.RotateRight(this._robotCurrentPosition.direction)
    //     : this.RotateRight(this._robotCurrentPosition.direction);
    this.dataSharingSrv.robotCurrentPosition.next(this._robotCurrentPosition);
  }

  RotateRight(rotation: number) {
    rotation = rotation + 90;
    if (rotation >= 360) {
      rotation = 0;
    }
  }

  RotateLeft(rotation: number) {
    rotation = rotation + 90;
    if (rotation >= 360) {
      rotation = 0;
    }
  }
}
