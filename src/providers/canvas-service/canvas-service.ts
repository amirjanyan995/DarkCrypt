import { HttpClient } from '@angular/common/http';
import {ElementRef, Injectable, ViewChild} from '@angular/core';

/*
  Generated class for the CanvasServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CanvasServiceProvider {
    @ViewChild('canvas') canvasEl: ElementRef;

    private _CANVAS   : any;
    private _CONTEXT  : any;

    private imgData: string;

    constructor() {
    }
    /**
     *  Set canvas initial configuration
     */
    public initialiseCanvas()
    {
        this._CANVAS 	    = this.canvasEl.nativeElement;
        if(this._CANVAS.getContext)
        {
            this._CONTEXT = this._CANVAS.getContext('2d');
        }
    }

    public drawImg(imgFullPath:string, ){

    }

    /**
     * Get image Base64 code
     * @returns {any}
     */
    public getDataURL(){
        //TODO extension
        return this._CANVAS.toDataURL('png');
    }

    clearCanvas()
    {
        this.imgData = null;
        this._CONTEXT.clearRect(0, 0, this._CANVAS.width, this._CANVAS.height);
    }
}
