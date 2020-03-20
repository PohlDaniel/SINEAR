import {FormControl, FormGroup, Validators} from '@angular/forms';

function validateDate(c: FormControl) {
  const DATE_REGEXP = /(0[1-9]|[12][0-9]|3[01]).(0[1-9]|1[012]).\d\d ([0]\d|[1]\d|2[0123]):00/;

  return DATE_REGEXP.test(c.value) ? null : {
    validateDate: {
      valid: false
    }
  };
}

export class EditActionForm extends FormGroup {

  constructor() {
    super({
      startDate: new FormControl('', [Validators.required, validateDate]),
      endDate: new FormControl('', [Validators.required, validateDate])
    });
  }

  get startDate(): FormControl {
    return this.get('startDate') as FormControl;
  }

  get endDate(): FormControl {
    return this.get('endDate') as FormControl;
  }
}
