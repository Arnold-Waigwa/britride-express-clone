#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/6aa044cdaf1e72b324c49994f8f40e77f4fb9204a1712b36aaaa756a74c85877/contract';
import endContract from '../../snapshots/6aa044cdaf1e72b324c49994f8f40e77f4fb9204a1712b36aaaa756a74c85877/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/b80b660c41ab0a19e3b06d4e7493b60dd284b8867b5abcdc05e777797e198d76/contract';
import startContract from '../../snapshots/b80b660c41ab0a19e3b06d4e7493b60dd284b8867b5abcdc05e777797e198d76/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'users',
        column: col('googleId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addUnique({
        schema: 'public',
        table: 'users',
        constraint: 'users_googleId_key',
        columns: ['googleId'],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
