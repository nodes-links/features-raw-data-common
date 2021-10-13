import { IRawTableData } from '../interfaces/IRawTableData';
import { ReplaySubject } from 'rxjs';
import { StoreRawDataOperationStatus, StoreRawDataErrorType } from '@nl/interfaces/raw-data';
export interface IRawDataServiceDataSet {
    status: StoreRawDataOperationStatus;
    errorType?: StoreRawDataErrorType;
    startDate?: Date;
    endDate?: Date;
    dataDate?: Date;
    currentDate?: Date;
    dateRange?: number;
    daysLeft?: number;
    wbs?: {
        [key: string]: any;
    };
    tasks?: any[];
    relationships?: any[];
    raw?: Array<IRawTableData>;
}
/**
 * This is making the raw data parsed from the import of primavera file (XER), available to other
 * services/components.
 *
 * @export
 * @class RawDataCommonService
 */
export declare class RawDataCommonService {
    static TMP_VERSION_KEY: string;
    /**
     * This is the property containing the actual data.
     */
    protected tmpRawData: Array<IRawTableData>;
    protected _subjects: {
        [versionRef: string]: ReplaySubject<IRawDataServiceDataSet>;
    };
    protected _data: {
        [versionRef: string]: IRawDataServiceDataSet;
    };
    protected _waitingOn: {
        [versionRef: string]: boolean;
    };
    /**
     * Service constructor.
     * @param PrimaveraParsingCommonEvents The RawDataService subscribes to the following PrimaveraEventsService events:
     *
     * 1. initializing: To clear the data.
     * 2. tableDiscovered: To add a new table.
     * 3. headersDiscovered: To add the table's headers.
     * 4. rowDiscovered: to add a row to a table.
     * 5. taskDiscovered: to update the start/end dates of the project.
     */
    constructor();
    for(versionRef: string): import("rxjs").Observable<IRawDataServiceDataSet>;
    startRawDataIngestion(): void;
    finishRawDataIngestion(): void;
    addVersion(versionRef: any, rawData: {
        data: Array<IRawTableData>;
    }): void;
    /**
     * Adds a new (empty) table to the list of tables.
     * @param index Table index in the list of tables.
     * @param title Table title.
     */
    addTable(index: number, title: string): void;
    /**
     * Adds the headers to the table at the given index.
     * @param index Table index in the list of tables.
     * @param headers An array of strings containing the the headers of the table at the given index. These are not in a user-friendly
     * format, instead they are as defined
     * [here](https://docs.oracle.com/cd/E38975_01/English/Mapping_and_Schema/Data_Mapping_Docs/OdsFieldMapTable.html).
     * The conversion to a friendlier format conversion happens at a later stage.
     */
    addHeaders(index: number, headers: string[]): void;
    /**
     * Adds a new row to the table at the given index.
     * @param index Table index in the list of tables.
     * @param row The row information in object form i.e. key/value pairs.
     */
    addRow(index: number, row: any): void;
    protected populate(versionRef: any, rawData?: {
        data: Array<IRawTableData>;
        status: StoreRawDataOperationStatus;
        errorType?: StoreRawDataErrorType;
    }): void;
    protected processResults(versionRef: any): void;
    private processProject;
    private processWbs;
    private processTasks;
    private processRelationships;
    /**
     * Revises the project start/end date after the addition of a newly discovered task.
     *
     * @private
     * @param {Moment} startDate Start date of the task.
     * @param {Moment} endDate End date of the task.
     * @memberof RawDataService
     */
    private reviseProjectDates;
    /**
     * Evaluates the duration of the entire project and stores it in the dateRange property.
     */
    private calculateDuration;
    /**
     * Evaluates the days left for this project based on DataDate and stores it in the projectDaysLeft property.
     */
    private calculateDaysLeft;
    /**
     * Returns the percentage completion of a task, as a string, on the given number of days after the project's start date.
     *
     * @param {Date} startDate The start date of the task.
     * @param {Date} endDate The end date of the task.
     * @param {number} duration The duration of the task. This could have been computed, but it's passed in for efficiency, as this
     * method is called all the time for objects whose duration is fixed and has been pre-computed.
     * @param {number} daysFromStart How many days since the start of the project have passed.
     * @returns {string}
     * @memberof RawDataService
     */
    getPercentComplete(versionRef: any, startDate: Date, endDate: Date, duration: number, daysFromStart: number): string;
    /**
     * Returns whether the task will have been completed on the given number of days after the project's start date.
     *
     * @param {Date} endDate The end date of the task.
     * @param {number} daysFromStart How many days since the start of the project have passed.
     * @returns {boolean}
     * @memberof RawDataService
     */
    isComplete(versionRef: any, endDate: Date, daysFromStart: number): boolean;
    getDaysFromStart(versionRef: any, date?: Date): number;
    private computeStartDate;
    private computeEndDate;
}
//# sourceMappingURL=raw-data-common.service.d.ts.map