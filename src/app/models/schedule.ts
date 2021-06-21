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
    public empty():boolean{
        if( this.monday.end == undefined && this.monday.start == undefined &&
            this.tuesday.end == undefined && this.tuesday.start == undefined &&
            this.wednesday.end == undefined && this.wednesday.start == undefined &&
            this.thursday.end == undefined && this.thursday.start == undefined &&
            this.friday.end == undefined && this.friday.start == undefined &&
            this.saturday.end == undefined && this.saturday.start == undefined &&
            this.sunday.end == undefined && this.sunday.start == undefined
        ){ return true }
        else{ return false}
    }
}