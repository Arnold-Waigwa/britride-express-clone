#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/15acd8d0c53876c3b8c8a39db5d8507cf06630ceb3e891664bd81a58410a6194/contract';
import startContract from '../../snapshots/15acd8d0c53876c3b8c8a39db5d8507cf06630ceb3e891664bd81a58410a6194/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/b80b660c41ab0a19e3b06d4e7493b60dd284b8867b5abcdc05e777797e198d76/contract';
import endContract from '../../snapshots/b80b660c41ab0a19e3b06d4e7493b60dd284b8867b5abcdc05e777797e198d76/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropColumn({ schema: 'public', table: 'users', column: 'firstName' }),
      this.dropColumn({ schema: 'public', table: 'users', column: 'lastName' }),
      this.addColumn({
        schema: 'public',
        table: 'users',
        column: col('first_name', 'character varying(50)', {
          codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 50 } },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'users',
        column: col('last_name', 'character varying(50)', {
          codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 50 } },
        }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
