export class Action {

  constructor(obj : any){

    if(obj){
      this.name = obj.name;
      this.startDate = obj.startDate;
      this.endDate = obj.endDate;
      this.finishedPlanning = obj.finishedPlanning;
      this.finished = obj.finished;
    }
  }

  name: string;
  startDate: number;
  endDate: number;
  finishedPlanning: boolean;
  finished: boolean;
}
