"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartedData2Part1605633296274 = void 0;
const migration_utils_1 = require("./migration-utils");
const whiteList = [
    // allTables.attachments,
    //+ allTables.boards,
    //+ allTables.categories,
    // allTables.members,
    // allTables.messages,
    // allTables.personal_messages,
    // allTables.pm_attachments,
    //+ allTables.pm_recipients,
    migration_utils_1.allTables.poll_choices,
    migration_utils_1.allTables.polls,
    migration_utils_1.allTables.related_subjects,
    migration_utils_1.allTables.topics,
];
class StartedData2Part1605633296274 {
    async up(queryRunner) {
        await migration_utils_1.migrationFillDataUp(queryRunner, whiteList);
    }
    async down(queryRunner) {
        await migration_utils_1.migrationFillDataDown(queryRunner, whiteList);
    }
}
exports.StartedData2Part1605633296274 = StartedData2Part1605633296274;
//# sourceMappingURL=1605633296274-StartedData2Part.js.map