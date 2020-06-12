// Copyright (c) 2020 by Michael Marucheck
//
// Use of this source code is governed by an MIT-style license that
// can be found in the LICENSE file distributed with this file.

import { fail, Brand } from "./internal";
import { DateLike, toDate } from "./DateLike";
import { toTimestamp } from "./Timestamp";
import { EpochMs, toEpochMs } from "./EpochMs";

// A range of dates in which years are 4 digits.
// Pessimistic because Date parses year="0001" as 1901.
export const MIN_DATE = toTimestamp(new Date("1000-01-01"));
export const MAX_DATE = toTimestamp(new Date("9999-12-31"));

export const MIN_EPOCH_MS = toEpochMs(MIN_DATE);
export const MAX_EPOCH_MS = toEpochMs(MAX_DATE);

export function clampEpochMs(ms: number): EpochMs {
  if (ms < MIN_EPOCH_MS) {
    return MIN_EPOCH_MS;
  }
  if (ms > MAX_EPOCH_MS) {
    return MAX_EPOCH_MS;
  }
  return ms as EpochMs;
}

// --------------------------------------------------------------
// Day

export type CalendarDay = string & Brand<"CalendarDay">;

const CALENDAR_DAY_REGEX = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/;

export function isDay(x: any): x is CalendarDay {
  if (typeof x !== "string") {
    return false;
  }
  const match = CALENDAR_DAY_REGEX.exec(x);
  if (match === null) {
    return false;
  }

  const day = dayString(
    Date.UTC(
      parseInt(match[1], 10),
      parseInt(match[2], 10) - 1, // Months are 0-based in Date
      parseInt(match[3], 10),
    ),
  );

  return x === day;
}

export function dayOrNull(x: string): CalendarDay | null {
  return isDay(x) ? x : null;
}

export function dayOrThrow(x: string): CalendarDay {
  return isDay(x) ? x : fail(`Not a valid day: '${x}'`);
}

export function toUtcDay(x: DateLike): CalendarDay {
  return isDay(x) ? x : (dayString(x) as CalendarDay);
}

function dayString(x: DateLike): string {
  return toDate(x).toISOString().substring(0, 10);
}

// --------------------------------------------------------------
// Month

export type CalendarMonth = string & Brand<"CalendarMonth">;

export function isMonth(x: any): x is CalendarMonth {
  return typeof x === "string" && isDay(`${x}-01`);
}

export function monthOrNull(x: string): CalendarMonth | null {
  return isMonth(x) ? x : null;
}

export function monthOrThrow(x: string): CalendarMonth {
  return isMonth(x) ? x : fail(`Not a valid month: '${x}'`);
}

export function toUtcMonth(x: DateLike): CalendarMonth {
  return isMonth(x)
    ? x
    : (toDate(x).toISOString().substring(0, 7) as CalendarMonth);
}

// --------------------------------------------------------------
// Year

export type CalendarYear = string & Brand<"CalendarYear">;

export function isYear(x: any): x is CalendarYear {
  return typeof x === "string" && isDay(`${x}-01-01`);
}

export function yearOrNull(x: string): CalendarYear | null {
  return isYear(x) ? x : null;
}

export function yearOrThrow(x: string): CalendarYear {
  return isYear(x) ? x : fail(`Not a valid year: '${x}'`);
}

export function toUtcYear(x: DateLike): CalendarYear {
  return isYear(x)
    ? x
    : (toDate(x).toISOString().substring(0, 4) as CalendarYear);
}
