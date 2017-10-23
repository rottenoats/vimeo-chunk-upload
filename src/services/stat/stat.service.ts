import {EventService} from "../event/event.service";
import {TimeUtil} from "../../utils/utils";
import {ChunkService} from "../chunk/chunk.service";
import {StatData} from "../../entities/stat_data";
/**
 * Created by Grimbode on 14/07/2017.
 *
 * Service that takes care of checking the total uploaded content and dispatches events to notify all listeners.
 *
 */

export class StatService {

    public si: number = -1;
    public totalStatData: StatData;
    public chunkStatData: StatData;
    public previousTotalPercent: number = 0;

    /**
     * constructor that takes two dependencies timerInterval and chunkService
     * @param timeInterval
     * @param chunkService
     */
    constructor(
        public timeInterval: number,
        public chunkService: ChunkService
    ){}

    /**
     * start method that starts the interval loop to constantly dispatch events with updated information.
     */
    public start(){
        this.totalStatData = this.create(true);
        this.startInterval();
    }

    /**
     * create method creates a new statData with information from  chunkservice.
     * @param isTotal
     * @returns {StatData}
     */
    public create(isTotal: boolean = false): StatData {
        let date = new Date();
        let size = (isTotal) ? this.chunkService.mediaService.media.file.size : this.chunkService.size;
        return new StatData(date, date, this.chunkService.preferredUploadDuration, 0, size);
    }

    /**
     * save method that takes a statData and saves it to the chunkStatData
     * @param timeData
     */
    public save(timeData: StatData){
        this.chunkStatData = timeData;
    }

    /**
     * calculateRatio method that calculates the decimal percent of how much has been uploaded (can be chunk or total)
     * @param loaded
     * @param total
     * @returns {number}
     */
    public calculateRatio(loaded: number, total: number): number{
        return loaded/total;
    }

    /**
     * calculatePercent method calculates the percent that has been uploaded.
     * @param loaded
     * @param total
     * @returns {number}
     */
    public calculatePercent(loaded: number, total: number): number{
        return Math.floor(this.calculateRatio(loaded, total)*100);
    }

    /**
     * updateTotal method that updates the total percent that has currently been uploaded.
     */
    public updateTotal(){
        this.totalStatData.loaded += this.chunkStatData.total;
    }

    /**
     * startInterval method that starts the interval loop to continously dispatch events with updated information on what has been uploaded.
     */
    public startInterval(){

        //If a previous interval exists, stop it.
        if(this.si > -1){
            this.stop();
        }

        //Create the new loop
        this.si = setInterval(()=>{

            //Calculate the chup upload percent
            let chunkPercent = this.calculatePercent(this.chunkStatData.loaded, this.chunkStatData.total);

            //If the chunk upload is completed we set the chunkPercent to 100 and reset the chunkStatDatat to 0
            if(this.chunkStatData.done){
                this.updateTotal();
                this.chunkStatData.total = this.chunkStatData.loaded = 0;
                chunkPercent = 100;
            }

            //Update the total uploaded
            this.totalStatData.loaded = Math.max(this.chunkService.offset, this.totalStatData.loaded);

            //Set the end to the chunk end
            this.totalStatData.end = this.chunkStatData.end;
            //Set the previous total percent value to the new highest
            this.previousTotalPercent = Math.max(this.totalStatData.loaded + this.chunkStatData.loaded, this.previousTotalPercent);

            //Calculate the current total percent
            let totalPercent = this.calculatePercent(
                this.previousTotalPercent,
                this.totalStatData.total
            );

            //emit chunk percent
            EventService.Dispatch("chunkprogresschanged", chunkPercent);

            if(this.totalStatData.done){
                totalPercent = 100;
            }

            //emit total percent
            EventService.Dispatch("totalprogresschanged", totalPercent);

        }, this.timeInterval)

    }

    /**
     * stop method that stops the interval loop, which will stop the flow of dispatched events.
     */
    public stop(){
        clearInterval(this.si);
    }

    /**
     * getChunkUploadDuration method that returns the current time it has taken to upload a chunk.
     * @returns {number}
     */
    public getChunkUploadDuration(): number{
        return TimeUtil.TimeToSeconds(this.chunkStatData.end.getTime() - this.chunkStatData.start.getTime());
    }

    /**
     * chunkIsOverPrefferedUploadTime method that checks if the duration time has exceeded the preffered upload duration.
     * @returns {boolean}
     */
    public chunkIsOverPrefferedUploadTime(): boolean{
        return this.getChunkUploadDuration() >= this.chunkService.preferredUploadDuration*1.5;
    }
}