import { IPrimaveraTable } from '../interfaces/IPrimaveraTable';
/**
 * This makes the primavera tables' configuration available as a promise. The promise gets resolved
 * by loading the contents of /assets/config/primavera-tables-config.json
 *
 * @export
 * @class TableConfigCommonService
 */
export declare class TableConfigCommonService {
    /**
     * The property where the table configs are stored.
     *
     * @type {Array<IPrimaveraTable>}
     * @memberof TableConfigCommonService
     */
    _tables: Array<IPrimaveraTable>;
    /**
     * The public promise that resolves to the tables' config. The config is loaded from the json file
     * only once. The results are then stored in the private property _tables and obtained from that in
     * subsequent calls to the promise.
     *
     * @type {Promise<Array<IPrimaveraTable>>}
     * @memberof TableConfigCommonService
     */
    tables: Promise<Array<IPrimaveraTable>>;
    constructor();
}
//# sourceMappingURL=table-config-common.service.d.ts.map