import {FormControl, FormGroup, Validators} from '@angular/forms';

export class NewTopicAreaForm extends FormGroup {

  constructor() {
    super({
      name: new FormControl('', [Validators.required, Validators.minLength(3)])
    });
  }

  get name(): FormControl {
    return this.get('name') as FormControl;
  }
}
