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
    public decode(key:string){
        return new Promise(resolve => {

            var data = this._CONTEXT.getImageData(0, 0, this._CANVAS.width, this._CANVAS.height);
            var pix = data.data;
            var i,j;
            let arr = [];
            let count=0;
            for (i = 16,j=0; i < pix.length; i += 4,j+=3) {
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
            arr = arr.slice(0,arr.length - 16);
            for(let i=0; i < arr.length;i+=8){
                let code = arr[i]+arr[i+1]+arr[i+2]+arr[i+3]+arr[i+4]+arr[i+5]+arr[i+6]+arr[i+7];
                text+=String.fromCharCode(this.binToDec(code));
            }
            if(key){
                let newKey = this.generateKey(key);
                text = this.deCrypt(text,newKey);
            }

            let message:Array<{message:string}> = [{
                message: text
            }];
            resolve(message)
        });
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

    public readPassword():string{
        var data = this._CONTEXT.getImageData(0, 0, this._CANVAS.width, this._CANVAS.height);
        var pix = data.data;
        let key = '';
        for(let i=8;i<16;i+=4){
            key += this.getLast(pix[i]);
            key += this.getLast(pix[i+1]);
            key += this.getLast(pix[i+2]);
        }
        return key.slice(0,key.length - 4);
    }

    /**
     * Encoding text
     * pix[0] : Indicates that container is contains message
     * pix[1] : Indicates that container is contains password
     * @param {string} message
     * @returns {Promise<any>}
     */
    public encode(message:string, password:string){
        return new Promise((resolve) => {
            var data = this._CONTEXT.getImageData(0, 0, this._CANVAS.width, this._CANVAS.height);
            var pix = data.data;

            // message pixel
            pix[0] = this.replace(pix[0], '01')
            pix[1] = this.replace(pix[1], '01')
            pix[2] = this.replace(pix[2], '11')

            if(password){
                let key = this.generateKey(password);
                // crypt message
                message = this.crypt(message, key);
                //key pixel
                pix[4] = this.replace(pix[4], '01');
                pix[5] = this.replace(pix[5], '01');
                pix[6] = this.replace(pix[6], '11');

                let keyArr = this.slice(key);
                // write key
                pix[8] = this.replace(pix[8], keyArr[0]);
                pix[9] = this.replace(pix[9], keyArr[1]);
                pix[10] = this.replace(pix[10], keyArr[2]);
                pix[12] = this.replace(pix[12], keyArr[3]);
                pix[13] = this.replace(pix[13], '00');
                pix[14] = this.replace(pix[14], '00');
                // end
            }
            let arr = this.textToArray(message);
            for (let i = 16,j=0; i < pix.length && j<arr.length; i += 4,j+=3) {
                pix[i  ] = this.replace(pix[i],arr[j]);
                pix[i+1] = this.replace(pix[i+1],arr[j+1]);
                pix[i+2] = this.replace(pix[i+2],arr[j+2]);
            }
            this._CONTEXT.putImageData(data, 0, 0);
            let dataUrl:Array<{data:string}> = [{
                data: this.getDataURL()
            }];
            resolve(dataUrl)
        })
    }

    /**
     * Encode message using key
     */
    private crypt(message:string, key:string):string{
        let newKey = this.binToDec(key);
        let newMessage = '';
        for(let i=0; i<message.length; i++){
            newMessage += String.fromCharCode(message.charCodeAt(i) ^ newKey);
        }
        return newMessage;
    }

    /**
     * Decode message using key
     */
    private deCrypt(message:string, key:string):string{
        let newKey = this.binToDec(key);
        let newMessage = '';
        for(let i=0; i<message.length; i++){
            newMessage += String.fromCharCode(message.charCodeAt(i) ^ newKey);
        }
        return newMessage;
    }

    /**
     * Check container is contains a password ?
     * @returns {string}
     */
    public isPasswordSet():boolean {
        var data = this._CONTEXT.getImageData(0, 0, this._CANVAS.width, this._CANVAS.height);
        var pix = data.data;

        return (this.getLast(pix[4]) === '01')
            &&(this.getLast(pix[5]) === '01')
            &&(this.getLast(pix[6]) === '11');
    }

    /**
     * Check container is contains message ?
     * @returns {string}
     */
    public isContainsMessage():boolean {
        var data = this._CONTEXT.getImageData(0, 0, this._CANVAS.width, this._CANVAS.height);
        var pix = data.data;
        return (this.getLast(pix[0]) === '01')
            &&(this.getLast(pix[1]) === '01')
            &&(this.getLast(pix[2]) === '11');
    }

    /**
     * Convert plain text to 8 bit key code
     * @param {string} password
     * @returns {any}
     */
    public generateKey(password:string){
        let arr = this.textToArray(password,8,false);
        let key = 0;
        if(arr.length >= 2) {
            key = this.binToDec(arr[0]) ^ this.binToDec(arr[1]);

            for (let i = 2; i < arr.length; i++) {
                key = key ^ this.binToDec(arr[i]);
            }

            return this.fillToStart(this.decToBin(key), 8);
        }
        return arr[0]
    }

    /**
     *
     *
     * @param {string} message
     * @param {number} length
     * @returns {any[]}
     */
    private slice(message:string, length:number = 2){
        let arr=[]
        for(let i=0;i<message.length;i+=length){
            arr.push(message.slice(i,i+length))
        }
        return arr;
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
    private textToArray(text:string, blockLength:number = 2, endBits:boolean = true){
        let arr = [];
        for(let i=0; i<text.length; i++){
            let code = this.fillToStart(this.decToBin(text.charCodeAt(i)));
            for(let j=0; j<code.length;j+=blockLength){
                arr.push(code.slice(j,j+blockLength));
            }
        }
        if(endBits) {
            for(let i=0; i< 16; i++){arr.push('00')}
        }
        return arr;
    }

    /**
     * Fill to start '110101' => '00110101'
     */
    private fillToStart(bin:string, length:number=16){
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
