"use strict";
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrationFillDataDown = exports.migrationFillDataUp = exports.walkByDBTables = exports.allTables = void 0;
const util = require("util");
const fs = require("fs");
const path = require("path");
const removePrefix = 'smf_';
const removePrefixRegexp = /smf_(\w+)/;
const removeTablePrefixRegexp = /`smf_(\w+)`/img;
const removeCommentsRegexp = /\/\*!\d+ .+\*\/\s*;/img;
var allTables;
(function (allTables) {
    allTables["attachments"] = "attachments";
    allTables["boards"] = "boards";
    allTables["categories"] = "categories";
    allTables["members"] = "members";
    allTables["messages"] = "messages";
    allTables["personal_messages"] = "personal_messages";
    allTables["pm_attachments"] = "pm_attachments";
    allTables["pm_recipients"] = "pm_recipients";
    allTables["poll_choices"] = "poll_choices";
    allTables["polls"] = "polls";
    allTables["related_subjects"] = "related_subjects";
    allTables["topics"] = "topics";
})(allTables = exports.allTables || (exports.allTables = {}));
function walkByDBTables(type, whiteList = Object.values(allTables)) {
    return __asyncGenerator(this, arguments, function* walkByDBTables_1() {
        const dbDataDirectory = path.resolve('data', 'db');
        // const readDir = util.promisify(fs.readdir)
        const readFile = util.promisify(fs.readFile);
        // const fileList = await readDir(dbDataDirectory)
        //
        // const fileLIst = fileList.filter(fileName => fileName.endsWith(`_${type}.sql`))
        for (const item of whiteList) {
            const file = `${removePrefix}${item}_${type}.sql`;
            const sql = yield __await(readFile(path.resolve(dbDataDirectory, file), 'utf-8'));
            const tableOrig = file.substr(0, file.length - `_${type}.sql`.length);
            const table = tableOrig === null || tableOrig === void 0 ? void 0 : tableOrig.replace(removePrefix, '');
            if (whiteList && whiteList.includes(table) === false) {
                continue;
            }
            const resultSql = sql
                .replace(removeTablePrefixRegexp, '`$1`')
                .replace(removeCommentsRegexp, '')
                .replace(/^set autocommit=0;\s*/igm, '')
                .replace(/^commit;\s*/igm, '');
            yield yield __await({
                table,
                sql: resultSql,
            });
        }
    });
}
exports.walkByDBTables = walkByDBTables;
async function migrationFillDataUp(queryRunner, whiteList) {
    var e_1, _a;
    try {
        for (var _b = __asyncValues(walkByDBTables('data', whiteList)), _c; _c = await _b.next(), !_c.done;) {
            const { table, sql } = _c.value;
            console.log(`Fill data for ${table}`);
            const sqlList = sql.split(/\n/img);
            for (const sqlListItem of sqlList) {
                const sql = sqlListItem.trim();
                if (sql) {
                    await queryRunner.query(sqlListItem);
                }
            }
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
exports.migrationFillDataUp = migrationFillDataUp;
async function migrationFillDataDown(queryRunner, whiteList) {
    var e_2, _a;
    try {
        for (var _b = __asyncValues(walkByDBTables('data', whiteList)), _c; _c = await _b.next(), !_c.done;) {
            const { table } = _c.value;
            const sql = `truncate table \`${table}\`;`;
            await queryRunner.query(sql);
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
exports.migrationFillDataDown = migrationFillDataDown;
//# sourceMappingURL=migration-utils.js.map