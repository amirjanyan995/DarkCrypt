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

    public updateStorage(){
        this.storage.get(Const.EXTENSION).then(extension => {
            this.extension = extension;
        });
        this.storage.get(Const.CHARACTER_TYPE).then(type => {
           this.characterType = type;
        });
    }
}
