import {
  Inject,
  Component,
  OnInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { isNumber } from 'lodash';
import { RobotService } from '../../services/robot.service';
import { DatasharingService } from '../../services/datasharing.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
  positionForm!: FormGroup;
  error: string = '';
  directions = ['NORTH', 'EAST', 'SOUTH', 'WEST'];

  constructor(
    private robotSrv: RobotService,
    private dataSrv: DatasharingService,
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.positionForm = this.fb.group({
      xFormControl: [0, [Validators.required]],
      yFormControl: [0, [Validators.required]],
      directionFormControl: ['NORTH', [Validators.required]],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  placeRobot(): void {
    const formValue = this.positionForm.value;
    const xAxis = formValue.xFormControl;
    const yAxis = formValue.yFormControl;
    const direction = formValue.directionFormControl;
    this.error = '';
    if (!isNumber(xAxis)) {
      this.error +=
        'The x Axis value should be numeric, please correct that before pursuing;';
    }

    if (!isNumber(yAxis)) {
      this.error +=
        'The y Axis value should be numeric, please correct that before pursuing;';
    }

    const dirIndex = this.directions.findIndex((d) => d === direction);

    if (dirIndex < 0) {
      this.error +=
        'The direction is not valid, please correct that before pursuing;';
    }
    if (this.error) {
      console.log(this.error);
      return;
    } else {
      this.robotSrv._setRobotPosition(xAxis, yAxis, direction);
    }
  }
}

export interface DialogData {
  x: 0;
  y: 0;
  d: 'EAST';
}
