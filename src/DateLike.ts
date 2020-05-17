// Copyright (c) 2020 by Michael Marucheck
//
// Use of this source code is governed by an MIT-style license that
// can be found in the LICENSE file distributed with this file.

// Valid formats for a date-like thing:
// * Date
// * Date.toISOString()
// * Date.getTime()
export type DateLike = Date | string | number;

export function toDate(x: DateLike): Date {
  switch (typeof x) {
    case "number":
      return new Date(x);
    case "string":
      return new Date(x);
    case "object":
      return x as Date;
  }
}
