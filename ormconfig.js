const dotenv = require('dotenv');

dotenv.config({
  path: '.env'
});

module.exports = [
  {
    // name: 'default',
    type: 'mariadb',
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    entities: ['dist/entities/**/*.entity{.ts,.js}'],
    entityPrefix: process.env.TABLE_PREFIX && '',
    synchronize: false,
    migrations: ["dist/migration/1*{.ts,.js}"],
    migrationsTableName: "migrations_typeorm",
    migrationsRun: false,
    cli: {
      migrationsDir: "migration",
      entitiesDir: "src/entities"
    },
  }
]
