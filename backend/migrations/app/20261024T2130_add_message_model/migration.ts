#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/4dc9dd4a876baf6e6fd6b8aa5759b6fe852efda4c4e61eed5347c664eef2b4ec/contract';
import endContract from '../../snapshots/4dc9dd4a876baf6e6fd6b8aa5759b6fe852efda4c4e61eed5347c664eef2b4ec/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/6aa044cdaf1e72b324c49994f8f40e77f4fb9204a1712b36aaaa756a74c85877/contract';
import startContract from '../../snapshots/6aa044cdaf1e72b324c49994f8f40e77f4fb9204a1712b36aaaa756a74c85877/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropConstraint({ schema: 'public', table: 'rides', constraint: 'rides_posterId_fkey', kind: 'foreignKey' }),
      this.addForeignKey({ schema: 'public', table: 'rides', foreignKey: { name: 'rides_posterId_fkey', columns: ['posterId'], references: { schema: 'public', table: 'users', columns: ['id'] }, onDelete: 'cascade' } }),
      this.dropConstraint({ schema: 'public', table: 'rides', constraint: 'rides_acceptorId_fkey', kind: 'foreignKey' }),
      this.addForeignKey({ schema: 'public', table: 'rides', foreignKey: { name: 'rides_acceptorId_fkey', columns: ['acceptorId'], references: { schema: 'public', table: 'users', columns: ['id'] }, onDelete: 'setNull' } }),
      this.createTable({ schema: 'public', table: 'messages', columns: [
        col('content', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        col('createdAt', 'timestamp', { notNull: true, default: fn('now()'), codecRef: { codecId: 'pg/timestamp-temporal@1' } }),
        col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        col('receiver_id', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
        col('rideId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        col('sender_id', 'int4', { codecRef: { codecId: 'pg/int4@1' } })
      ], constraints: [primaryKey(['id'])] }),
      this.createIndex({ schema: 'public', table: 'messages', index: 'messages_receiver_id_idx_7bffc4d3', columns: ["receiver_id"] }),
      this.createIndex({ schema: 'public', table: 'messages', index: 'messages_rideId_idx_2125d498', columns: ["rideId"] }),
      this.createIndex({ schema: 'public', table: 'messages', index: 'messages_sender_id_idx_311853a4', columns: ["sender_id"] }),
      this.addForeignKey({ schema: 'public', table: 'messages', foreignKey: { name: 'messages_sender_id_fkey', columns: ['sender_id'], references: { schema: 'public', table: 'users', columns: ['id'] }, onDelete: 'setNull' } }),
      this.addForeignKey({ schema: 'public', table: 'messages', foreignKey: { name: 'messages_receiver_id_fkey', columns: ['receiver_id'], references: { schema: 'public', table: 'users', columns: ['id'] }, onDelete: 'setNull' } }),
      this.addForeignKey({ schema: 'public', table: 'messages', foreignKey: { name: 'messages_rideId_fkey', columns: ['rideId'], references: { schema: 'public', table: 'rides', columns: ['id'] }, onDelete: 'cascade' } }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
