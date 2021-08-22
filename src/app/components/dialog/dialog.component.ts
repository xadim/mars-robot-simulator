import { Inject, Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { isNumber, round } from 'lodash';
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
    let x = this.data.x ? this.data.x : 0;
    let y = this.data.y ? this.data.y : 0;
    let dir = this.data.d ? this.data.d : 'NORTH';
    this.positionForm = this.fb.group({
      xFormControl: [x, [(Validators.required, Validators.maxLength(1))]],
      yFormControl: [y, [Validators.required, Validators.maxLength(1)]],
      directionFormControl: [dir, [Validators.required]],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  placeRobot(): void {
    const formValue = this.positionForm.value;
    let xAxis = formValue.xFormControl;
    let yAxis = formValue.yFormControl;
    const direction = formValue.directionFormControl;
    const dirIndex = this.directions.findIndex((d) => d === direction);
    this._inputValidations(xAxis, yAxis, dirIndex);

    if (this.error) {
      return;
    } else {
      xAxis = round(xAxis);
      yAxis = round(yAxis);
      this.robotSrv.setRobotPosition(xAxis, yAxis, direction);
    }
  }

  /**
   *
   * @param xAxis
   * @param yAxis
   * @param dirIndex
   */
  _inputValidations(xAxis: number, yAxis: number, dirIndex: number) {
    this.error = '';
    if (!isNumber(xAxis) || xAxis < 0 || xAxis > 4) {
      this.error +=
        'The x Axis value should be numeric and 0 ≤ X ≤ 4, please correct that before pursuing;';
    }

    if (!isNumber(yAxis) || xAxis < 0 || xAxis > 4) {
      this.error +=
        'The y Axis value should be numeric and 0 ≤ Y ≤ 4, please correct that before pursuing;';
    }

    if (dirIndex < 0) {
      this.error +=
        'The direction is not valid, please correct that before pursuing;';
    }
  }
}

export interface DialogData {
  x: 0;
  y: 0;
  d: 'NORTH';
}
