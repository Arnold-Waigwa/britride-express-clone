#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/15acd8d0c53876c3b8c8a39db5d8507cf06630ceb3e891664bd81a58410a6194/contract';
import endContract from '../../snapshots/15acd8d0c53876c3b8c8a39db5d8507cf06630ceb3e891664bd81a58410a6194/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/65883bd27a64c9c0c971c0fe10c299e68413b155f9a2ea2ca8e0ff2163d60f8a/contract';
import startContract from '../../snapshots/65883bd27a64c9c0c971c0fe10c299e68413b155f9a2ea2ca8e0ff2163d60f8a/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'users',
        column: col('firstName', 'character varying(50)', {
          codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 50 } },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'users',
        column: col('lastName', 'character varying(50)', {
          codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 50 } },
        }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
