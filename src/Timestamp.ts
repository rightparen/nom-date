// Copyright (c) 2020 by Michael Marucheck
//
// Use of this source code is governed by an MIT-style license that
// can be found in the LICENSE file distributed with this file.

import { fail } from "./internal";
import { DateLike, toDate } from "./DateLike";

enum TimestampBrand {}
export type Timestamp = string & TimestampBrand;

const TIMESTAMP_REGEX = /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}(:[0-9]{2}(\.[0-9]+)?)?Z$/;

export function isTimestamp(x: any): x is Timestamp {
  return typeof x === "string" && TIMESTAMP_REGEX.test(x);
}

export function toTimestamp(x: DateLike): Timestamp {
  return timestampOrThrow(toDate(x).toISOString());
}

export function timestampOrNull(x: string): Timestamp | null {
  return isTimestamp(x) ? x : null;
}

export function timestampOrThrow(x: string): Timestamp {
  return isTimestamp(x) ? x : fail(`Unexpected timestamp format: '${x}'`);
}
