"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartedData3Part1605633348664 = void 0;
const migration_utils_1 = require("./migration-utils");
const whiteList = [
    migration_utils_1.allTables.attachments,
];
class StartedData3Part1605633348664 {
    async up(queryRunner) {
        await migration_utils_1.migrationFillDataUp(queryRunner, whiteList);
    }
    async down(queryRunner) {
        await migration_utils_1.migrationFillDataDown(queryRunner, whiteList);
    }
}
exports.StartedData3Part1605633348664 = StartedData3Part1605633348664;
//# sourceMappingURL=1605633348664-StartedData3Part.js.map