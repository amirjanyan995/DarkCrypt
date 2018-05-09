import { Injectable } from '@angular/core';
import { File } from "@ionic-native/file";
import { Storage } from "@ionic/storage";
import * as Const from '../../util/constants';

declare var window;

@Injectable()
export class FileServiceProvider {

    private extension:string = null;
    private characterType:string = null;

    constructor(
        private file: File,
        public storage: Storage)
    {
        this.updateStorage();
    }

    /**
     * Check if folder does't exists then create it.
     * @param pathName      - Path to folder
     * @param folderName    - Folder Name
     * @returns {Promise<any>}
     */
    public checkAndCreateDir(pathName, folderName){
        let self = this;
        let promise = new Promise((resolve, reject) => {
            self.file.checkDir(pathName, folderName).then(() => {
                resolve(pathName + folderName + '/');
            }).catch(err => {
                self.file.createDir(pathName, folderName, false)
                    .then(() => {
                        resolve(pathName + folderName + '/');
                    }).catch(() => {
                    reject('Folder can\'t be created.');
                })
            })
        });
        return promise;
    }

    /**
     * Copy the image to a project gallery folder
     *
     * @param pathName      - Path to file.
     * @param fileName      - File name.
     * @param newPathName   - New path name.
     * @param newFileName   - New file name.
     */
    public copyFileToDir(pathName, fileName, newPathName, newFileName = null) {
        let self = this;
        // check name and create new name
        newFileName = ( newFileName === null ) ? this.createTempFileName() : newFileName + '.' + this.extension;

        let promise = new Promise((resolve, reject) => {
            self.file.copyFile(pathName, fileName, newPathName , newFileName).then(success => {
                resolve(newPathName + newFileName);
            }).catch(err => {
                reject('File can\'t be copied to directory.');
            });
        });
        return promise;
    }

    /**
     * Copy File to Project Directory
     * @param pathName - File current location
     * @param fileName - File name
     * @param newFileName - New file name
     */
    public copyFileToProjectDir(pathName, fileName, newFileName = null){
        let self = this;
        let promise = new Promise((resolve, reject) => {
            self.checkAndCreateDir(self.file.externalRootDirectory, Const.FOLDER_NAME).then(dir => {
                self.copyFileToDir(pathName, fileName, dir ,newFileName).then(dir => {
                    resolve(dir)
                }).catch(err => {
                    reject(err);
                })
            }).catch((err) => {
                reject(err);
            })
        });
        return promise;
    }

    /**
     * Copy File to Project Directory
     * @param pathName - File current location
     * @param fileName - File name
     * @param newFileName - New file name
     */
    public copyFileToAppCacheDir(pathName, fileName, newFileName = null){
        let self = this;
        let promise = new Promise((resolve, reject) => {
            self.copyFileToDir(pathName, fileName, this.file.externalCacheDirectory ,newFileName).then(dir => {
                resolve(dir)
            }).catch(err => {
                reject(err);
            })
        });
        return promise;
    }

    /**
     * Remove file
     * @param pathName - File current location
     * @param fileName - File name
     * @returns {Promise<any>}
     */
    public removeFile(pathName, fileName){
        let self = this;
        let promise = new Promise((resolve, reject) => {
            self.file.removeFile(pathName,fileName).then( () => {
                resolve('File successfully removed.')
            }).catch( err => {
                reject(err);
            })
        })
        return promise;
    }

    public getImgFile(path:string, name:string){
        let self = this;
        return new Promise((resolve, reject) => {
            self.file.resolveDirectoryUrl(path).then(url => {
                self.file.getFile(url,name,{}).then( file => {
                    window.resolveLocalFileSystemURL(file.nativeURL, (fileEntry) => {
                        fileEntry.getMetadata((metadata) => {
                            let details = {
                                name: file.name,
                                path: file.nativeURL,
                                size: metadata.size,
                                date: metadata.modificationTime
                            }
                            resolve(details);
                        });
                    });
                })
            });
        })
    }

    /**
     *  Create a new name for the image
     * @returns {string}
     */
    public createTempFileName(extension = true) {
        var d = new Date(),
            newFileName = d.getTime().toString();

        newFileName += (extension) ? '.' + (this.extension || 'jpg') : '';

        return newFileName;
    }

    /**
     * Create file and write decoded message:
     * @param {string} message
     * @param {string} name
     * @returns {Promise<any>}
     */
    public saveAsTxt(message:string, name:string) {
        let self = this;
        return new Promise((resolve, reject) => {
            self.checkAndCreateDir(self.file.externalRootDirectory, Const.FOLDER_NAME).then(dir => {
                self.file.resolveDirectoryUrl(dir.toString()).then((path)=>{
                    self.file.getFile(path,name + '.txt',{create:true}).then(file => {
                        file.createWriter(function(fileWriter) {
                            fileWriter.write(message);
                            resolve(file.fullPath);
                        });
                    })
                });
            })
        });
    }

    /**
     * Save Image
     * Convert img base64 code to img
     * @param {string} base64
     */
    public saveImage(base64:string){
        var myBaseString = base64;

        // Split the base64 string in data and contentType
        var block = myBaseString.split(";");

        // Get the content type
        var dataType = block[0].split(":")[1];

        // get the real base64 content of the file
        var realData = block[1].split(",")[1];

        // The path where the file will be created
        var folderpath = this.file.externalRootDirectory + 'DarkCrypt/';

        // The name of your file, note that you need to know if is .png,.jpeg etc
        var filename = 'img_aaaaa.' + this.extension;

        this.savebase64AsImageFile(folderpath,filename,realData,dataType);
    }

    /**
     * Convert a base64 string in a Blob according to the data and contentType.
     *
     * @param b64Data {String} Pure base64 string without contentType
     * @param contentType {String} the content type of the file i.e (image/jpeg - image/png - text/plain)
     * @param sliceSize {Int} SliceSize to process the byteCharacters
     * @see http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
     * @return Blob
     */
    private b64toBlob(b64Data, contentType = '', sliceSize = 512) {

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, {type: contentType});
        return blob;
    }

    /**
     * Create a Image file according to its database64 content only.
     *
     * @param folderpath {String} The folder where the file will be created
     * @param filename {String} The name of the file that will be created
     * @param content {Base64 String} Important : The content can't contain the following string (data:image/png[or any other format];base64,). Only the base64 string is expected.
     */
    private savebase64AsImageFile(folderpath,filename,content,contentType){

        // Convert the base64 string in a Blob
        var DataBlob = this.b64toBlob(content,contentType);

        let self = this;
        this.file.resolveDirectoryUrl(folderpath).then((path)=>{
            self.file.getFile(path,filename,{create:true}).then(file => {
                file.createWriter(function(fileWriter) {
                    fileWriter.write(DataBlob);
                }, function(){
                    alert('Unable to save file in path '+ folderpath);
                });
            })
        });
    }

    /**
     * Update existing data
     */
    public updateStorage(){
        this.storage.get(Const.EXTENSION).then(extension => {
            this.extension = extension;
        });
        this.storage.get(Const.CHARACTER_TYPE).then(type => {
            this.characterType = type;
        });
    }
}
