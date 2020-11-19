"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartedData6Part1605633760825 = void 0;
const migration_utils_1 = require("./migration-utils");
const whiteList = [
    //+ allTables.attachments,
    //+ allTables.boards,
    //+ allTables.categories,
    //+ allTables.members,
    migration_utils_1.allTables.messages,
];
class StartedData6Part1605633760825 {
    async up(queryRunner) {
        await migration_utils_1.migrationFillDataUp(queryRunner, whiteList);
    }
    async down(queryRunner) {
        await migration_utils_1.migrationFillDataDown(queryRunner, whiteList);
    }
}
exports.StartedData6Part1605633760825 = StartedData6Part1605633760825;
//# sourceMappingURL=1605633760825-StartedData6Part.js.map