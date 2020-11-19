"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartedData4Part1605633676281 = void 0;
const migration_utils_1 = require("./migration-utils");
const whiteList = [
    //+ allTables.attachments,
    //+ allTables.boards,
    //+ allTables.categories,
    migration_utils_1.allTables.members,
];
class StartedData4Part1605633676281 {
    async up(queryRunner) {
        await migration_utils_1.migrationFillDataUp(queryRunner, whiteList);
    }
    async down(queryRunner) {
        await migration_utils_1.migrationFillDataDown(queryRunner, whiteList);
    }
}
exports.StartedData4Part1605633676281 = StartedData4Part1605633676281;
//# sourceMappingURL=1605633676281-StartedData4Part.js.map