import {Day} from './day';
export class Schedule{
    monday:Day;
    tuesday:Day;
    wednesday:Day;
    thursday:Day;
    friday:Day;
    saturday:Day;
    sunday:Day;
    constructor(){
        this.monday = new Day();
        this.tuesday = new Day();
        this.wednesday = new Day();
        this.thursday = new Day();
        this.friday = new Day();
        this.saturday = new Day();
        this.sunday = new Day();
    }
}