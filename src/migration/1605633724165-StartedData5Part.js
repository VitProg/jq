"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartedData5Part1605633724165 = void 0;
const migration_utils_1 = require("./migration-utils");
const whiteList = [
    //+ allTables.attachments,
    //+ allTables.boards,
    //+ allTables.categories,
    //+ allTables.members,
    // allTables.messages,
    migration_utils_1.allTables.personal_messages,
    migration_utils_1.allTables.pm_attachments,
];
class StartedData5Part1605633724165 {
    async up(queryRunner) {
        await migration_utils_1.migrationFillDataUp(queryRunner, whiteList);
    }
    async down(queryRunner) {
        await migration_utils_1.migrationFillDataDown(queryRunner, whiteList);
    }
}
exports.StartedData5Part1605633724165 = StartedData5Part1605633724165;
//# sourceMappingURL=1605633724165-StartedData5Part.js.map