import { Component, OnInit, Renderer2 } from '@angular/core';
import { RobotService } from '../../services/robot.service';
import { DialogComponent } from '../dialog/dialog.component';
// import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { DatasharingService } from '../../services/datasharing.service';
import { isEmpty } from 'lodash';

@Component({
  selector: 'app-tabletop',
  templateUrl: './tabletop.component.html',
  styleUrls: ['./tabletop.component.scss'],
})
export class TabletopComponent implements OnInit {
  title = 'Mars Robot Simulator';
  showPlayground = false;
  showReport = false;
  robotCurrentPosition: any = [];
  message = 'Press PLACE to start playing..';
  image = new Image();
  errorMessage = '';

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
        this.putRobotOnTheScene(data);
      }
    });
  }

  ngAfterViewInit() {
    // console.log('on after view init', this.robotInput);
    // this returns null
  }

  /**
   *
   * @param data
   */
  putRobotOnTheScene(data: any) {
    console.log(data);

    let playground = document.getElementById('playground');
    let robot = document.getElementById('robotInput');
    let robotImg = document.getElementById('robotImg');
    this.showPlayground = true;
    playground!.classList.add('gameScene');
    robot!.style.display = 'block';
    robot!.style.marginLeft = parseInt(data.xAxis) + 'px';
    robot!.style.marginTop = data.yAxis + 'px';
    this.image.className = '';
    this.image.classList.add('rotate' + data.direction);
    if (isEmpty(this.image.src)) {
      this.image.src = '../../../assets/robot.svg';
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
   * Change the robot's Position
   */
  place(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '375px',
      // data: { name: this.name, animal: this.animal },
    });

    // dialogRef.beforeClosed().subscribe((res) => {
    //   console.log('The dialog will be closed');
    //   // this.animal = result;
    //   console.log(res);
    // });

    // dialogRef.afterClosed().subscribe((result) => {
    //   console.log('The dialog was closed');
    //   // this.animal = result;
    //   console.log(result);
    // });

    // console.log(dialogRef);
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

  setErrorMessage() {
    this.errorMessage = 'Please place the robot on the platform first.';
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }
}
