"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartedData1Part1605632212595 = void 0;
const migration_utils_1 = require("./migration-utils");
const whiteList = [
    // allTables.attachments,
    migration_utils_1.allTables.boards,
    migration_utils_1.allTables.categories,
    // allTables.members,
    // allTables.messages,
    // allTables.personal_messages,
    // allTables.pm_attachments,
    migration_utils_1.allTables.pm_recipients,
];
class StartedData1Part1605632212595 {
    async up(queryRunner) {
        await migration_utils_1.migrationFillDataUp(queryRunner, whiteList);
    }
    async down(queryRunner) {
        await migration_utils_1.migrationFillDataDown(queryRunner, whiteList);
    }
}
exports.StartedData1Part1605632212595 = StartedData1Part1605632212595;
//# sourceMappingURL=1605632212595-StartedData1Part.js.map