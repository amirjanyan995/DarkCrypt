import {ElementRef, Injectable} from '@angular/core';

@Injectable()
export class CanvasServiceProvider {

    private  canvasEl: ElementRef;
    private _CANVAS   : any;
    private _CONTEXT  : any;

    private imgData: string;

    constructor() {
    }
    /**
     *  Set canvas initial configuration
     */
    public initialiseCanvas(canvasEl)
    {
        this.canvasEl = canvasEl;

        this._CANVAS 	    = this.canvasEl.nativeElement;
        if(this._CANVAS.getContext)
        {
            this._CONTEXT = this._CANVAS.getContext('2d');
        }
    }

    public drawImg(imgFullPath:string){
        let source = new Image();
        source.crossOrigin = 'Anonymous';
        source.src = imgFullPath;
        source.onload = () => {
            this._CANVAS.height = source.height;
            this._CANVAS.width = source.width;
            this._CONTEXT.drawImage(source, 0, 0);

            // this._CONTEXT.font = "32px impact";
            // this._CONTEXT.textAlign = 'center';
            // this._CONTEXT.fillStyle = 'black';
            // this._CONTEXT.fillText('Hello World', this._CANVAS.width / 2, this._CANVAS.height * 0.8);
        };
    }

    /**
     * Get Image ALL pixels
     * @returns {any}
     */
    public getAllPixelData(){
        var imgd = this._CONTEXT.getImageData(0, 0, this._CANVAS.width, this._CANVAS.height);

        return imgd;
    }

    public decode(){
        var data = this._CONTEXT.getImageData(0, 0, this._CANVAS.width, this._CANVAS.height);
        var pix = data.data;
        var i,j;
        let arr = [];
        let count =0;
        for (i = 0,j=0; i < pix.length; i += 4,j+=3) {
            let a = this.getLast(pix[i]);
            if(!this.binToDec(a)) {
                count++;
                if(count >8)break;
            }else count=0
            arr.push(a);

            a = this.getLast(pix[i+1]);
            if(!this.binToDec(a)) {
                count++;
                if(count >8)break;
            }else count=0
            arr.push(a)

            a = this.getLast(pix[i+2]);
            if(!this.binToDec(a)) {
                count++;
                if(count >8)break;
            }else count=0

            arr.push(a)
        }
        arr = arr.splice(0,arr.length-8,)
        let text:string='';
        for(i=0;i<arr.length;i+=4){
            let code = arr[i]+arr[i+1]+arr[i+2]+arr[i+3];
            text+=String.fromCharCode(this.binToDec(code));
        }
        return text;
    }
    private getLast(num:number){
        let code = this.fillToStart(this.decToBin(num))
        return code.slice(code.length-2,code.length);
    }

    public encode(message:string){
        let arr = this.textToArray(message);
        var data = this._CONTEXT.getImageData(0, 0, this._CANVAS.width, this._CANVAS.height);
        var pix = data.data;
        for (let i = 0,j=0; i < pix.length && j<arr.length; i += 4,j+=3) {
            pix[i  ] = this.replace(pix[i],arr[j]);
            pix[i+1] = this.replace(pix[i+1],arr[j+1]);
            pix[i+2] = this.replace(pix[i+2],arr[j+2]);
        }
        this._CONTEXT.putImageData(data, 0, 0);
        return this.getDataURL();
    }

    private replace(num:number, sub:string){
        if(!sub) return num;
        let pix = this.fillToStart(this.decToBin(num));
        pix = pix.slice(0,pix.length - 2);
        pix += sub;
        return this.binToDec(pix);
    }

    private textToArray(text:string,length:number = 2){
        let arr = [];
        for(let i=0; i<text.length; i++){
            let code = this.fillToStart(this.decToBin(text.charCodeAt(i)));
            for(let j=0; j<code.length;j+=length){
                arr.push(code.slice(j,j+length));
            }
        }
        for(let i=0; i< 8; i++){arr.push('00')}
        return arr;
    }

    private fillToStart(bin:string){
        for(let i=bin.length; i!=8;i++){
            bin = '0' + bin;
        }
        return bin;
    }

    /**
     * Convert integer to binary
     */
    private decToBin(dec:number):string {
        return (dec >>> 0).toString(2);
    }

    /**
     * Convert binary to integer
     */
    private binToDec(bin:string):number {
        return parseInt(bin, 2);
    }

    public fillNewData(data:ImageData){
        this._CONTEXT.putImageData(data, 0, 0);
    }

    /**
     * Get pixel data by X - Y coordinates
     * @param {number} x
     * @param {number} y
     * @returns {any}
     */
    public getPixelData(x:number, y:number){
        return this._CONTEXT.getImageData(x, y, 1, 1).data;
    }

    /**
     * Get image Base64 code
     * @returns {any}
     */
    public getDataURL(){
        return this._CANVAS.toDataURL();
    }

    clearCanvas()
    {
        this.imgData = null;
        this._CONTEXT.clearRect(0, 0, this._CANVAS.width, this._CANVAS.height);
    }
}
