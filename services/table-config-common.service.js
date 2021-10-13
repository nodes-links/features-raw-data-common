"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableConfigCommonService = void 0;
/**
 * This makes the primavera tables' configuration available as a promise. The promise gets resolved
 * by loading the contents of /assets/config/primavera-tables-config.json
 *
 * @export
 * @class TableConfigCommonService
 */
class TableConfigCommonService {
    constructor() {
        this.tables = new Promise(resolve => {
            if (this._tables)
                resolve(this._tables);
        });
    }
}
exports.TableConfigCommonService = TableConfigCommonService;
//# sourceMappingURL=table-config-common.service.js.map