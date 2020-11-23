const dotenv = require('dotenv');

const isTsNode = process.env.RUN_MODE === 'ts-node'

dotenv.config({
  path: '.env'
});


module.exports = [
  {
    type: 'mariadb',
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    entities:
      isTsNode
        ? ['src/server/entities/**/*.entity{.ts,.js}']
        : ['dists/server/entities/**/*.entity{.ts,.js}'],
    entityPrefix: process.env.TABLE_PREFIX && '',
    synchronize: false,
    migrationsRun: false,
    dropSchema: false,
    migrations: ["dist/server/migration/1*{.ts,.js}"],
    migrationsTableName: "migrations_typeorm",
    cli: {
      migrationsDir: "src/migration",
      entitiesDir: "src/server/entities"
    },
  }
]
