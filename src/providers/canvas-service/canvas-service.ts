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

    /**
     * Decode message
     * @returns {string}
     */
    public decode(){
        var data = this._CONTEXT.getImageData(0, 0, this._CANVAS.width, this._CANVAS.height);
        var pix = data.data;
        var i,j;
        let arr = [];
        let count =0;
        for (i = 0,j=0; i < pix.length; i += 4,j+=3) {
            let a = this.getLast(pix[i]);
            arr.push(a);
            if(!this.binToDec(a)) {
                count++;
                if(count>=16)break;
            }else count=0

            a = this.getLast(pix[i+1]);
            arr.push(a)
            if(!this.binToDec(a)) {
                count++;
                if(count>=16)break;
            }else count=0

            a = this.getLast(pix[i+2]);
            arr.push(a)
            if(!this.binToDec(a)) {
                count++;
                if(count>=16)break;
            }else count=0

        }
        let text:string='';
        let symbols = [10]; // enter button
        for(let i=0; i < arr.length;i+=4){
            let code = arr[i]+arr[i+1]+arr[i+2]+arr[i+3];
            if(this.binToDec(code) < 32
                && symbols.indexOf(this.binToDec(code)) === -1
                && (i+4) < arr.length)
            {
                i+=4;
                code += arr[i]+arr[i+1]+arr[i+2]+arr[i+3];
            }
            text+=String.fromCharCode(this.binToDec(code));
        }
        return text;
    }

    /**
     * Get Latest bits
     * @param {number} num
     * @param {number} bitCount
     * @returns {string}
     */
    private getLast(num:number, bitCount:number = 2){
        let code = this.fillToStart(this.decToBin(num))
        return code.slice(code.length-2,code.length);
    }

    /**
     * Encoding text
     * @param {string} message
     * @returns {Promise<any>}
     */
    public encode(message:string){
        return new Promise((resolve, reject) => {
            let arr = this.textToArray(message);
            var data = this._CONTEXT.getImageData(0, 0, this._CANVAS.width, this._CANVAS.height);
            var pix = data.data;
            for (let i = 0,j=0; i < pix.length && j<arr.length; i += 4,j+=3) {
                pix[i  ] = this.replace(pix[i],arr[j]);
                pix[i+1] = this.replace(pix[i+1],arr[j+1]);
                pix[i+2] = this.replace(pix[i+2],arr[j+2]);
            }
            this._CONTEXT.putImageData(data, 0, 0);
            let dataUrl:Array<{data:string}> = [                {
                data: this.getDataURL()
            }];
            resolve(dataUrl);
        })
    }

    /**
     *  Replace pixel value
     * @param {number} num - pixel value
     * @param {string} sub
     *
     * @returns {number}
     */
    private replace(num:number, sub:string){
        if(!sub) return num;
        let pix = this.fillToStart(this.decToBin(num));
        pix = pix.slice(0,pix.length - 2);
        pix += sub;
        return this.binToDec(pix);
    }

    /**
     * Convert message to binary array
     *
     * @param {string} text
     * @param {number} length
     *
     * @returns {any[]}
     */
    private textToArray(text:string,length:number = 2){
        let arr = [];
        for(let i=0; i<text.length; i++){
            let code = this.fillToStart(this.decToBin(text.charCodeAt(i)));
            for(let j=0; j<code.length;j+=length){
                arr.push(code.slice(j,j+length));
            }
        }
        for(let i=0; i<16; i++){arr.push('00')}
        return arr;
    }

    /**
     * Fill to start '110101' => '00110101'
     */
    private fillToStart(bin:string){
        let length = bin.length > 8 ? bin.length + (8 - (bin.length%8)) : 8;
        for(let i=bin.length; i<length; i++){
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
