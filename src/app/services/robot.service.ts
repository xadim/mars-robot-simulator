import { Injectable } from '@angular/core';
import { DatasharingService } from '../services/datasharing.service';

@Injectable({
  providedIn: 'root',
})
export class RobotService {
  currentPosition: any = {};
  unit: number = 74; // margin 0f 14 to place the object in the middle of the square
  platformMinusRobotSize: number = 298; // margin = 2px
  // tracer:
  units = 5;

  constructor(private dataSharingSrv: DatasharingService) {}

  /***
   * Place the robot on the playground
   * @param xPosition
   * @param yPosition
   * @param facing
   */
  setRobotPosition(xPosition: number, yPosition: number, facing: string) {
    this.currentPosition.xPosition = xPosition;
    this.currentPosition.yPosition = yPosition;
    this.currentPosition.facing = facing;
    this.currentPosition.xAxis = xPosition <= 0 ? 2 : xPosition * this.unit;
    this.currentPosition.yAxis =
      yPosition <= 0
        ? this.platformMinusRobotSize
        : this.platformMinusRobotSize - yPosition * this.unit; // 360 is the playground height, 60 is the robot size
    this.currentPosition.direction = this.getDirectionDegree(facing);
    this.dataSharingSrv.robotCurrentPosition.next(this.currentPosition);
  }

  /**
   *
   * @param d
   * @returns direction
   */
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
   * Moves the robot by one unit position inside the table top
   * Then sets the current robot object attributes
   */
  move() {
    let facing = this.currentPosition.facing;
    switch (facing) {
      case 'NORTH':
        if (this.currentPosition.yPosition < this.units - 1) {
          this.currentPosition.yPosition += 1;
        }
        break;
      case 'SOUTH':
        if (this.currentPosition.yPosition > 0) {
          this.currentPosition.yPosition -= 1;
        }
        break;
      case 'EAST':
        if (this.currentPosition.xPosition < this.units - 1) {
          this.currentPosition.xPosition += 1;
        }
        break;
      case 'WEST':
        if (this.currentPosition.xPosition > 0) {
          this.currentPosition.xPosition -= 1;
        }
        break;
    }
    this.setRobotPosition(
      this.currentPosition.xPosition,
      this.currentPosition.yPosition,
      this.currentPosition.facing
    );
  }

  /***
   * change the robot facing by 90 degrees using LEFT or RIGHT Keys
   * @param newFacing
   */
  rotate(newFacing: string) {
    switch (this.currentPosition.facing) {
      case 'NORTH':
        this.currentPosition.facing = newFacing === 'LEFT' ? 'WEST' : 'EAST';
        break;
      case 'SOUTH':
        this.currentPosition.facing = newFacing === 'LEFT' ? 'EAST' : 'WEST';
        break;
      case 'EAST':
        this.currentPosition.facing = newFacing === 'LEFT' ? 'NORTH' : 'SOUTH';
        break;
      case 'WEST':
        this.currentPosition.facing = newFacing === 'LEFT' ? 'SOUTH' : 'NORTH';
        break;
    }
    this.currentPosition.direction = this.getDirectionDegree(
      this.currentPosition.facing
    );
    this.dataSharingSrv.robotCurrentPosition.next(this.currentPosition);
  }
}
