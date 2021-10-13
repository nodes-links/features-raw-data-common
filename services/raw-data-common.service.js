"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RawDataCommonService = void 0;
const _ = require("lodash");
const moment = require('moment');
const rxjs_1 = require("rxjs");
const date_helpers_1 = require("@nl/util/date-helpers");
const raw_data_1 = require("@nl/interfaces/raw-data");
/**
 * This is making the raw data parsed from the import of primavera file (XER), available to other
 * services/components.
 *
 * @export
 * @class RawDataCommonService
 */
class RawDataCommonService {
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
    constructor() {
        /**
         * This is the property containing the actual data.
         */
        this.tmpRawData = [];
        this._subjects = {};
        this._data = {};
        this._waitingOn = {};
    }
    for(versionRef) {
        const subjectExists = this._subjects[versionRef];
        if (!subjectExists)
            this._subjects[versionRef] = new rxjs_1.ReplaySubject(1);
        return this._subjects[versionRef].asObservable();
    }
    startRawDataIngestion() {
        this.for(RawDataCommonService.TMP_VERSION_KEY); // to initialize the subject if it doesn't exist
        this.tmpRawData = [];
    }
    finishRawDataIngestion() {
        this.populate(RawDataCommonService.TMP_VERSION_KEY, {
            data: this.tmpRawData,
            status: raw_data_1.StoreRawDataOperationStatus.Success
        });
        this._subjects[RawDataCommonService.TMP_VERSION_KEY].next(this._data[RawDataCommonService.TMP_VERSION_KEY]);
    }
    addVersion(versionRef, rawData) {
        if (!this._subjects[versionRef]) {
            this._subjects[versionRef] = new rxjs_1.ReplaySubject(1);
        }
        this.populate(versionRef, Object.assign(Object.assign({}, rawData), { status: raw_data_1.StoreRawDataOperationStatus.Success }));
        this._subjects[versionRef].next(this._data[versionRef]);
    }
    /**
     * Adds a new (empty) table to the list of tables.
     * @param index Table index in the list of tables.
     * @param title Table title.
     */
    addTable(index, title) {
        this.tmpRawData[index] = {
            settings: {
                data: [],
                colHeaders: null
            },
            title: title
        };
    }
    /**
     * Adds the headers to the table at the given index.
     * @param index Table index in the list of tables.
     * @param headers An array of strings containing the the headers of the table at the given index. These are not in a user-friendly
     * format, instead they are as defined
     * [here](https://docs.oracle.com/cd/E38975_01/English/Mapping_and_Schema/Data_Mapping_Docs/OdsFieldMapTable.html).
     * The conversion to a friendlier format conversion happens at a later stage.
     */
    addHeaders(index, headers) {
        this.tmpRawData[index].settings.colHeaders = headers;
    }
    /**
     * Adds a new row to the table at the given index.
     * @param index Table index in the list of tables.
     * @param row The row information in object form i.e. key/value pairs.
     */
    addRow(index, row) {
        this.tmpRawData[index].settings.data.push(row);
    }
    populate(versionRef, rawData = {
        data: [],
        status: raw_data_1.StoreRawDataOperationStatus.Success
    }) {
        this._data[versionRef] = { raw: rawData.data, status: rawData.status, errorType: rawData.errorType };
        if (rawData.status === raw_data_1.StoreRawDataOperationStatus.Success) {
            this.processResults(versionRef);
        }
    }
    processResults(versionRef) {
        this.processProject(versionRef);
        this.processWbs(versionRef);
        this.processTasks(versionRef);
        this.processRelationships(versionRef);
        this.calculateDuration(versionRef);
        this.calculateDaysLeft(versionRef);
    }
    processProject(versionRef) {
        try {
            const projectTable = _.find(this._data[versionRef].raw, t => t.title === 'PROJECT');
            if (projectTable) {
                const dataDateProject = _.chain(projectTable.settings.data)
                    .filter(p => p.loaded_scope_level === '7')
                    .minBy('last_recalc_date')
                    .value();
                if (dataDateProject && dataDateProject.last_recalc_date) {
                    this._data[versionRef].dataDate = moment.utc(dataDateProject.last_recalc_date).startOf('day').toDate();
                }
                else {
                    this._data[versionRef].dataDate = null;
                }
            }
        }
        catch (error) {
            throw error;
        }
    }
    processWbs(versionRef) {
        try {
            const wbss = this._data[versionRef].raw.find(t => t.title === 'PROJWBS');
            if (!wbss || !wbss.settings.data) {
                this._data[versionRef].wbs = null;
            }
            else {
                this._data[versionRef].wbs = wbss.settings.data.reduce(function (map, obj) {
                    map[obj.wbs_id] = Object.assign(Object.assign({}, obj), { tasks: [] });
                    return map;
                }, {});
            }
        }
        catch (error) {
            throw error;
        }
    }
    processTasks(versionRef) {
        try {
            const schedule = this._data[versionRef];
            const tasksTable = _.find(this._data[versionRef].raw, t => t.title === 'TASK');
            schedule.tasks = [];
            tasksTable.settings.data.forEach(row => {
                const id = row.task_id;
                const name = row.task_name;
                const code = row.task_code;
                const wbsId = row.wbs_id;
                const wbsName = schedule.wbs && schedule.wbs[wbsId] ? schedule.wbs[wbsId].wbs_name : null;
                const rawTargetStartDate = new Date(row.target_start_date);
                const rawTargetEndDate = new Date(row.target_end_date);
                const rawActualStartDate = row.act_start_date ? new Date(row.act_start_date) : null;
                const rawActualEndDate = row.act_end_date ? new Date(row.act_end_date) : null;
                const rawReEndDate = row.reend_date ? new Date(row.reend_date) : null;
                const startDate = date_helpers_1.setStartOfDay(new Date(row.target_start_date));
                const endDate = date_helpers_1.addDays(date_helpers_1.setStartOfDay(new Date(row.target_end_date)), 1);
                const actualStartDate = row.act_start_date ? date_helpers_1.setStartOfDay(new Date(row.act_start_date)) : null;
                const actualEndDate = row.act_end_date ? date_helpers_1.addDays(date_helpers_1.setStartOfDay(new Date(row.act_end_date)), 1) : null;
                const reEndDate = row.reend_date ? date_helpers_1.addDays(date_helpers_1.setStartOfDay(new Date(row.reend_date)), 1) : null;
                const computedStartDate = this.computeStartDate(actualStartDate, actualEndDate, reEndDate, startDate);
                const computedEndDate = this.computeEndDate(actualStartDate, actualEndDate, reEndDate, endDate);
                const rawComputedStartDate = this.computeStartDate(rawActualStartDate, rawActualEndDate, rawReEndDate, rawTargetStartDate);
                const rawComputedEndDate = this.computeEndDate(rawActualStartDate, rawActualEndDate, rawReEndDate, rawTargetEndDate);
                const isActualized = !!actualEndDate;
                const isStartActualized = !!actualStartDate && (!!actualEndDate || !!reEndDate);
                const type = ['TT_FinMile', 'TT_Mile'].find(v => v === row.task_type) ? 'milestone' : 'task';
                const rawType = row.task_type;
                const task = {
                    id,
                    name,
                    code,
                    startDate,
                    endDate,
                    actualStartDate,
                    actualEndDate,
                    reEndDate,
                    computedStartDate,
                    computedEndDate,
                    type,
                    rawType,
                    wbsId,
                    wbsName,
                    rawTargetStartDate,
                    rawTargetEndDate,
                    rawActualStartDate,
                    rawActualEndDate,
                    rawReEndDate,
                    rawComputedStartDate,
                    rawComputedEndDate,
                    isActualized,
                    isStartActualized
                };
                schedule.tasks.push(task);
                schedule.wbs[wbsId].tasks.push(task);
                this.reviseProjectDates(versionRef, computedStartDate, computedEndDate);
            });
        }
        catch (error) {
            throw error;
        }
    }
    processRelationships(versionRef) {
        try {
            const schedule = this._data[versionRef];
            const relTable = _.find(this._data[versionRef].raw, t => t.title === 'TASKPRED');
            schedule.relationships = [];
            relTable.settings.data.forEach(row => {
                const sourceId = row.pred_task_id;
                const targetId = row.task_id;
                const lag = Math.floor(row.lag_hr_cnt / 8) || 0;
                const type = row.pred_type;
                const originalId = row.task_pred_id;
                schedule.relationships.push({ sourceId, targetId, lag, type, originalId });
            });
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * Revises the project start/end date after the addition of a newly discovered task.
     *
     * @private
     * @param {Moment} startDate Start date of the task.
     * @param {Moment} endDate End date of the task.
     * @memberof RawDataService
     */
    reviseProjectDates(versionRef, startDate, endDate) {
        const scheduleStartDate = this._data[versionRef].startDate;
        if (!scheduleStartDate || startDate.getTime() < scheduleStartDate.getTime()) {
            this._data[versionRef].startDate = new Date(startDate);
        }
        const scheduleEndDate = this._data[versionRef].endDate;
        if (!scheduleEndDate || endDate.getTime() > scheduleEndDate.getTime()) {
            this._data[versionRef].endDate = new Date(endDate);
        }
    }
    /**
     * Evaluates the duration of the entire project and stores it in the dateRange property.
     */
    calculateDuration(versionRef) {
        const scheduleStartDate = this._data[versionRef].startDate;
        const scheduleEndDate = this._data[versionRef].endDate;
        this._data[versionRef].dateRange = date_helpers_1.daysDiff(scheduleEndDate, scheduleStartDate);
    }
    /**
     * Evaluates the days left for this project based on DataDate and stores it in the projectDaysLeft property.
     */
    calculateDaysLeft(versionRef) {
        const scheduleEndDate = this._data[versionRef].endDate;
        const scheduleDataDate = new Date(this._data[versionRef].dataDate);
        date_helpers_1.setStartOfDay(scheduleDataDate);
        this._data[versionRef].daysLeft = date_helpers_1.daysDiff(scheduleEndDate, scheduleDataDate);
    }
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
    getPercentComplete(versionRef, startDate, endDate, duration, daysFromStart) {
        const schedule = this._data[versionRef];
        if (date_helpers_1.daysDiff(endDate, schedule.startDate) < daysFromStart) {
            return '100%';
        }
        if (date_helpers_1.daysDiff(startDate, schedule.startDate) > daysFromStart) {
            return '0%';
        }
        return '' + (100 * (daysFromStart - date_helpers_1.daysDiff(startDate, schedule.startDate))) / duration + '%';
    }
    /**
     * Returns whether the task will have been completed on the given number of days after the project's start date.
     *
     * @param {Date} endDate The end date of the task.
     * @param {number} daysFromStart How many days since the start of the project have passed.
     * @returns {boolean}
     * @memberof RawDataService
     */
    isComplete(versionRef, endDate, daysFromStart) {
        const schedule = this._data[versionRef];
        return date_helpers_1.daysDiff(endDate, schedule.startDate) < daysFromStart;
    }
    getDaysFromStart(versionRef, date) {
        const schedule = this._data[versionRef];
        if (!date) {
            date = this._data[versionRef].currentDate;
        }
        return date_helpers_1.daysDiff(date, schedule.startDate);
    }
    computeStartDate(actualStartDate, actualEndDate, reEndDate, startDate) {
        return !!actualStartDate && (actualEndDate || reEndDate) ? actualStartDate : startDate;
    }
    computeEndDate(actualStartDate, actualEndDate, reEndDate, endDate) {
        if (!!actualStartDate && !!actualEndDate) {
            return actualEndDate;
        }
        if (!!actualStartDate && !!reEndDate) {
            return reEndDate;
        }
        return endDate;
    }
}
exports.RawDataCommonService = RawDataCommonService;
RawDataCommonService.TMP_VERSION_KEY = '_.TMP._';
//# sourceMappingURL=raw-data-common.service.js.map