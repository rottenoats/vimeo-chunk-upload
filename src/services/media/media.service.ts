import {Media} from "../../entities/media";
import {HttpService} from "../http/http.service";
import {VIMEO_ROUTES} from "../../routes/routes";
/**
 * Created by kfaulhaber on 21/07/2017.
 */

export class MediaService {

    public media: Media;

    /**
     * constructor that initiates the services with the list of dependencies
     * @param httpService
     * @param file
     * @param data
     * @param upgrade_to_1080
     * @param useDefaultFileName
     * @param editVideoOnComplete
     */
    constructor(
        public httpService: HttpService,
        file: File,
        data: any,
        upgrade_to_1080: boolean,
        useDefaultFileName: boolean,
        public editVideoOnComplete: boolean
    ){
        if(useDefaultFileName){
            data["name"] = file.name;
        }
        this.media = new Media(file, data, upgrade_to_1080);
    }

    /**
     * updateVideoData method that sends a request to edit video information.
     * Will not work if the token does not have the "EDIT" scope. Will return a 403 forbidden.
     * @param {string} token
     * @param {number} vimeoId
     * @returns {Promise<T>}
     */
    public updateVideoData<T>(token: string, vimeoId: number): Promise<T>{

        let params = this.media.data;
        let query = Object.keys(params).map(key=>`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join('&');
        let request = HttpService.CreateRequest("PATCH", VIMEO_ROUTES.VIDEOS(vimeoId), query, {
            Authorization: `Bearer ${token}`
        });
        return this.httpService.send(request);
    }

    /**
     * GetMeta static method returns an object with data from updateVideoData response
     * @param {number} vimeoId
     * @param {object} data
     * @returns {{id: number, link: (any|HTMLLinkElement|(function(string): string)), name: any, uri: any, createdTime: any}}
     */
    public static GetMeta(vimeoId: number, data: any = {}): Object{
        return {
            id:             vimeoId,
            link:           data.link           || null,
            name:           data.name           || null,
            uri:            data.uri            || null,
            createdTime:    data.created_time   || null
        };
    }
}