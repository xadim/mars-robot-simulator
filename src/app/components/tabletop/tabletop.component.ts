import { Component, OnInit, Renderer2 } from '@angular/core';
import { RobotService } from '../../services/robot.service';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DatasharingService } from '../../services/datasharing.service';
import { isEmpty } from 'lodash';

@Component({
  selector: 'app-tabletop',
  templateUrl: './tabletop.component.html',
  styleUrls: ['./tabletop.component.scss'],
})
export class TabletopComponent implements OnInit {
  showPlayground = false;
  showReport = false;
  robotCurrentPosition: any = [];
  message = 'Press PLACE to start playing..';
  image = new Image();
  errorMessage = '';
  robotUrl = '../../../assets/robot.svg';

  constructor(
    private renderer: Renderer2,
    private robotSrv: RobotService,
    private dataSrv: DatasharingService,
    public dialog: MatDialog // public dataRobot: RobotPosition
  ) {}

  ngOnInit(): void {
    this.dataSrv.robotCurrentPosition.subscribe((data: any) => {
      if (data) {
        this.message = '';
        this.robotCurrentPosition = data;
        this.positionRobot(data);
      }
    });
  }

  /**
   * position the robot on the stage
   * @param data
   */
  positionRobot(data: any) {
    let playground = document.getElementById('playground');
    let robot = document.getElementById('robotInput');
    this.showPlayground = true;
    playground!.classList.add('stage');
    robot!.style.display = 'block';
    robot!.style.marginLeft = parseInt(data.xAxis) + 'px';
    robot!.style.marginTop = data.yAxis + 'px';
    this.renderRobot(robot, data.direction);
  }

  /**
   * create / rotate the robot object
   * @param robot
   * @param direction
   */
  renderRobot(robot: any, direction: number) {
    this.image.className = '';
    this.image.style.transform = 'rotate(' + direction + 'deg)';

    if (isEmpty(this.image.src)) {
      this.image.src = this.robotUrl;
      robot!.appendChild(this.image);
    }
  }
  /**
   * Turn the robot right
   */
  rotateRight(): void {
    if (!isEmpty(this.robotCurrentPosition)) {
      this.robotSrv.rotate('RIGHT');
    } else {
      this.setErrorMessage();
    }
  }

  /**
   * Turn the robot left
   */
  rotateLeft(): void {
    if (!isEmpty(this.robotCurrentPosition)) {
      this.robotSrv.rotate('LEFT');
    } else {
      this.setErrorMessage();
    }
  }

  /**
   * Move the robot toward the direction in the place object
   */
  move(): void {
    if (!isEmpty(this.robotCurrentPosition)) {
      this.robotSrv.move();
    } else {
      this.setErrorMessage();
    }
  }

  /**
   * report the robot's position
   */
  report(): void {
    if (!isEmpty(this.robotCurrentPosition)) {
      this.showReport = true;
    } else {
      this.setErrorMessage();
    }
  }

  /**
   * Change the robot's Position
   */
  place(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '375px',
      data: {
        x: this.robotCurrentPosition.xPosition,
        y: this.robotCurrentPosition.yPosition,
        d: this.robotCurrentPosition.facing,
      },
    });
  }

  /**
   * set standard guide message for users to start at the right point
   */
  setErrorMessage() {
    this.errorMessage =
      'Please press PLACE to put the robot on the platform first.';
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }
}
