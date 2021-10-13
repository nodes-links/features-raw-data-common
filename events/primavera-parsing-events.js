"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrimaveraParsingCommonEvents = void 0;
const rxjs_1 = require("rxjs");
/**
 * This service provides access to events related with parsing primavera data into other formats
 * like graph and raw/table formats. By using Subject, it is possible to use this service for both subscribing
 * and triggering these events.
 *
 * @export
 * @class PrimaveraParsingCommonEvents
 */
class PrimaveraParsingCommonEvents {
    constructor() {
        /**
         * When triggered by some other service/component, this tells the primavera parsing service to start processing the results.
         */
        this.parsingResultsStarted = new rxjs_1.Subject();
        /**
         * This is triggered by the primavera parsing service when the results have finished processing.
         */
        this.parsingResultsCompleted = new rxjs_1.Subject();
        /**
         * This is triggered when a new data row is discovered in the raw data.
         */
        this.rowDiscovered = new rxjs_1.Subject();
        /**
         * This is triggered when a new headers row is discovered in the raw data.
         */
        this.headersDiscovered = new rxjs_1.Subject();
        /**
         * This is triggered when a new table row is discovered in the raw data.
         */
        this.tableDiscovered = new rxjs_1.Subject();
    }
}
exports.PrimaveraParsingCommonEvents = PrimaveraParsingCommonEvents;
//# sourceMappingURL=primavera-parsing-events.js.map