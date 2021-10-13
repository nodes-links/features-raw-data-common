import { Subject } from 'rxjs';
import { IPapaResults } from '../interfaces/papa-results';
/**
 * This service provides access to events related with parsing primavera data into other formats
 * like graph and raw/table formats. By using Subject, it is possible to use this service for both subscribing
 * and triggering these events.
 *
 * @export
 * @class PrimaveraParsingCommonEvents
 */
export declare class PrimaveraParsingCommonEvents {
    /**
     * When triggered by some other service/component, this tells the primavera parsing service to start processing the results.
     */
    parsingResultsStarted: Subject<IPapaResults>;
    /**
     * This is triggered by the primavera parsing service when the results have finished processing.
     */
    parsingResultsCompleted: Subject<{
        error?: Error;
    }>;
    /**
     * This is triggered when a new data row is discovered in the raw data.
     */
    rowDiscovered: Subject<{
        tableIndex: number;
        row: any;
    }>;
    /**
     * This is triggered when a new headers row is discovered in the raw data.
     */
    headersDiscovered: Subject<{
        tableIndex: number;
        headers: string[];
    }>;
    /**
     * This is triggered when a new table row is discovered in the raw data.
     */
    tableDiscovered: Subject<{
        tableIndex: number;
        title: string;
    }>;
}
//# sourceMappingURL=primavera-parsing-events.d.ts.map