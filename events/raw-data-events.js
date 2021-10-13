"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RawDataCommonEvents = void 0;
const rxjs_1 = require("rxjs");
/**
 * This class provides access to events related with processing the raw data to extract graph data.
 * By using Subject, it is possible to use this service for both subscribing and triggering these events.
 *
 * @export
 * @class RawDataCommonEvents
 */
class RawDataCommonEvents {
    constructor() {
        /**
         * This is triggered when a project task is discovered in the raw data.
         *
         * @type {Subject<IPrimaveraTask[]>}
         * @memberof RawDataCommonEvents
         */
        this.tasksDiscovered = new rxjs_1.Subject();
        /**
         * This is triggered when an edge (i.e. relationship between two tasks) is discovered in the raw data.
         *
         * @type {Subject<{ sourceId: string; targetId: string; lag: number; type: string }[]>}
         * @memberof RawDataCommonEvents
         */
        this.edgesDiscovered = new rxjs_1.Subject();
        /**
         * This is triggered by the primavera parsing service right before it starts processing the results.
         *
         * @type {Subject<void>}
         * @memberof RawDataCommonEvents
         */
        this.initializing = new rxjs_1.Subject();
        /**
         * This is triggered when processing results completed
         *
         * @type {Subject<void>}
         * @memberof RawDataCommonEvents
         */
        this.processingResultsCompleted = new rxjs_1.Subject();
        /**
         * This is triggered when the current version is changing
         *
         * @type {Subject<void>}
         * @memberof RawDataCommonEvents
         */
        this.currentVersionChanging = new rxjs_1.Subject();
        /**
         * This is triggered when a new version is initialized
         *
         * @type {Subject<void>}
         * @memberof RawDataCommonEvents
         */
        this.initialized = new rxjs_1.Subject();
    }
}
exports.RawDataCommonEvents = RawDataCommonEvents;
//# sourceMappingURL=raw-data-events.js.map