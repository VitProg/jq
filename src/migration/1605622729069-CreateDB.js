"use strict";
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDB1605622729069 = void 0;
const migration_utils_1 = require("./migration-utils");
class CreateDB1605622729069 {
    async up(queryRunner) {
        var e_1, _a;
        try {
            for (var _b = __asyncValues(migration_utils_1.walkByDBTables('create')), _c; _c = await _b.next(), !_c.done;) {
                const { table, sql } = _c.value;
                console.log(`create table: ${table}`);
                await queryRunner.query(sql);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    async down(queryRunner) {
        var e_2, _a;
        try {
            for (var _b = __asyncValues(migration_utils_1.walkByDBTables('create')), _c; _c = await _b.next(), !_c.done;) {
                const { table } = _c.value;
                try {
                    console.log(`drop table: ${table}`);
                    await queryRunner.query(`drop table \`${table}\`;`);
                }
                catch (_d) { }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
    }
}
exports.CreateDB1605622729069 = CreateDB1605622729069;
//# sourceMappingURL=1605622729069-CreateDB.js.map