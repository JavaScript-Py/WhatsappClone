import { TextMeasure } from 'pdfjs-dist/build/pdf.worker.js';
import { ClassEvent } from "./../Utils/ClassEvent.js";

export class Model extends ClassEvent {

    constructor(){
        super();
    }


    static _data = {};

    fromJSON(json){
        this._data = Object.assign(Model._data, json);
        console.log("this._data", this._data);
        console.log("this", this);
        this.trigger('datachange', Model._data);
    }


    static toJSON(){
        return Model._data;
    }

}