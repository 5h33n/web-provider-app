export class Day{
    start:Date | undefined;
    end:Date | undefined;
    constructor(){
        this.start = undefined;
        this.end = undefined;
    }
    setStart(s: Date | undefined){
        this.start = s;
    }
    setEnd(e: Date | undefined){
        this.end = e;
    }
}