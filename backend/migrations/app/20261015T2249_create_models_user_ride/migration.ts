#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/65883bd27a64c9c0c971c0fe10c299e68413b155f9a2ea2ca8e0ff2163d60f8a/contract';
import endContract from '../../snapshots/65883bd27a64c9c0c971c0fe10c299e68413b155f9a2ea2ca8e0ff2163d60f8a/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/a51b4833fdaffe730572670ccc27dd89af7e0726ab3de7f428d21702d687cc15/contract';
import startContract from '../../snapshots/a51b4833fdaffe730572670ccc27dd89af7e0726ab3de7f428d21702d687cc15/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
  sql,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropTable({ schema: 'public', table: 'Post' }),
      this.dropTable({ schema: 'public', table: 'User' }),
      this.createTable({
        schema: 'public',
        table: 'rides',
        columns: [
          col('acceptorId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('createdAt', 'timestamp', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamp-temporal@1' },
          }),
          col('departure', 'timestamp', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamp-temporal@1' },
          }),
          col('departureLocation', 'character varying(255)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 255 } },
          }),
          col('description', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('destinationLocation', 'character varying(255)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 255 } },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('posterId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('price', 'numeric(10,2)', {
            notNull: true,
            codecRef: { codecId: 'pg/numeric@1', typeParams: { precision: 10, scale: 2 } },
          }),
          col('status', 'text', {
            notNull: true,
            default: lit('OPEN'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('title', 'character varying(50)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 50 } },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression('rides_status_check_270848c8', sql`"status" IN ('OPEN', 'ACCEPTED')`),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'users',
        columns: [
          col('email', 'character varying(255)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 255 } },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('passwordHash', 'text', { codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'users',
        constraint: 'users_email_key',
        columns: ['email'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'rides',
        index: 'rides_acceptorId_idx_336f5317',
        columns: ['acceptorId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'rides',
        index: 'rides_posterId_idx_981844b1',
        columns: ['posterId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'rides',
        foreignKey: {
          name: 'rides_posterId_fkey',
          columns: ['posterId'],
          references: { schema: 'public', table: 'users', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'rides',
        foreignKey: {
          name: 'rides_acceptorId_fkey',
          columns: ['acceptorId'],
          references: { schema: 'public', table: 'users', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
