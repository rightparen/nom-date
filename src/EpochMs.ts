// Copyright (c) 2020 by Michael Marucheck
//
// Use of this source code is governed by an MIT-style license that
// can be found in the LICENSE file distributed with this file.

import { DateLike } from "./DateLike";
import { Brand } from "./internal";

// Milliseconds used as duration
export type DurationMs = number & Brand<"DurationMs">;

export function isDurationMs(x: any): x is DurationMs {
  return typeof x === "number";
}

export function asDurationMs(n: number): DurationMs {
  return n as DurationMs;
}

export const SECOND_MS = asDurationMs(1000);
export const MINUTE_MS = asDurationMs(60 * SECOND_MS);
export const HOUR_MS = asDurationMs(60 * MINUTE_MS);
export const DAY_MS = asDurationMs(24 * HOUR_MS);

export interface DurationSpec {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  ms?: number;
}

export function durationMs(spec: DurationSpec): DurationMs {
  return asDurationMs(
    (spec.days || 0) * DAY_MS +
      (spec.hours || 0) * HOUR_MS +
      (spec.minutes || 0) * MINUTE_MS +
      (spec.seconds || 0) * SECOND_MS +
      (spec.ms || 0),
  );
}

// Milliseconds since UNIX epoch (like `Date.now()`)
export type EpochMs = number & Brand<"EpochMs">;

export function isEpochMs(x: any): x is EpochMs {
  return typeof x === "number";
}

function asEpochMs(n: number): EpochMs {
  return n as EpochMs;
}

export function toEpochMs(x: DateLike): EpochMs {
  switch (typeof x) {
    case "number":
      return asEpochMs(x);
    case "string":
      return asEpochMs(new Date(x).getTime());
    case "object":
      return asEpochMs(x.getTime());
  }
}

export function nowEpochMs(): EpochMs {
  return Date.now() as EpochMs;
}

// These are probably more trouble than they're worth..
export namespace DurationCalc {
  export function offset(base: EpochMs, duration: DurationMs): EpochMs {
    return asEpochMs(base + duration);
  }

  export function between(start: EpochMs, end: EpochMs): DurationMs {
    return asDurationMs(end - start);
  }

  export function sum(...durations: DurationMs[]): DurationMs {
    return asDurationMs(durations.reduce((acc, x) => acc + x, 0));
  }

  export function negate(duration: DurationMs): DurationMs {
    return asDurationMs(-duration);
  }

  export function max<T extends DurationMs | EpochMs>(...xs: T[]): T {
    return Math.max(...xs) as T;
  }

  export function min<T extends DurationMs | EpochMs>(...xs: T[]): T {
    return Math.min(...xs) as T;
  }
}
