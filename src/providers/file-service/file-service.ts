import { Injectable } from '@angular/core';
import { File } from "@ionic-native/file";
import * as Const from '../../util/constants';

@Injectable()
export class FileServiceProvider {

    constructor(private file: File) {

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
    public copyFileToDir(pathName, fileName, newPathName, newFileName) {
        let self = this;
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
    public copyFileToProjectDir(pathName, fileName, newFileName){
        let self = this;
        let promise = new Promise((resolve, reject) => {
            let projectDirPath = self.file.externalRootDirectory + Const.FOLDER_NAME + '/';
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
    public copyFileToAppCacheDir(pathName, fileName, newFileName){
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
                console.log(err);
                reject(err);
            })
        })
        return promise;
    }

}
