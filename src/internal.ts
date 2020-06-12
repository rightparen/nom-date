// Copyright (c) 2020 by Michael Marucheck
//
// Use of this source code is governed by an MIT-style license that
// can be found in the LICENSE file distributed with this file.

export function fail(message: string): never {
  throw Error(message);
}

export class Brand<K extends string> {
  // NOTE: This must be protected, not private.  If it's private, the TypeScript
  // compiler will erase the type of _brand_ from the type declaration (.d.ts)
  // file.  And without this type, Brand<"foo"> and Brand<"bar"> would be
  // compatible types!
  protected _brand_: K;
  constructor() {
    fail("Not constructable");
  }
}
