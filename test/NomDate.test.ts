// Copyright (c) 2020 by Michael Marucheck
//
// Use of this source code is governed by an MIT-style license that
// can be found in the LICENSE file distributed with this file.

import { DateLike, toDate } from "../src/DateLike";
import {
  isTimestamp,
  toTimestamp,
  timestampOrNull,
  timestampOrThrow,
} from "../src/Timestamp";
import {
  isDurationMs,
  durationMs,
  DAY_MS,
  HOUR_MS,
  MINUTE_MS,
  SECOND_MS,
  isEpochMs,
  toEpochMs,
  DurationMs,
  DurationCalc,
} from "../src/EpochMs";
import {
  isDay,
  dayOrThrow,
  dayOrNull,
  toUtcDay,
  isMonth,
  monthOrThrow,
  monthOrNull,
  toUtcMonth,
  isYear,
  yearOrThrow,
  yearOrNull,
  toUtcYear,
} from "../src/CalendarTypes";

describe("NomDate", () => {
  const now = new Date(2020, 5 - 1, 16, 14, 47);
  const nowIso = now.toISOString();
  const nowMs = now.getTime();
  const nowForms: DateLike[] = [
    now,
    now.toISOString(), // "2020"
    now.getTime(),
  ];
  const nowDay = "2020-05-16";
  const nowMonth = "2020-05";
  const nowYear = "2020";

  // Allow specifying minute, second, or sub-second precision.
  const nowIsos = [
    "2020-05-16T14:47Z",
    "2020-05-16T14:47:00Z",
    "2020-05-16T14:47:00.0Z",
    "2020-05-16T14:47:00.00Z",
    "2020-05-16T14:47:00.000Z",
    "2020-05-16T14:47:00.0000Z",
    "2020-05-16T14:47:00.00000Z",
    "2020-05-16T14:47:00.000000Z",
    "2020-05-16T14:47:00.0000000Z",
  ];

  // Date constructor does accept some things shorter than this,
  // e.g. "2020-05-Z", but I don't think we should.
  const malformedNowIsos = [
    "2020-05-16TZ",
    "2020-05-16T1Z",
    "2020-05-16T14Z",
    "2020-05-16T14:Z",
    "2020-05-16T14:4Z",
    "2020-05-16T14:47:Z",
    "2020-05-16T14:47:0Z",
    "2020-05-16T14:47:00.Z",
    "020-05-16T14:47Z",
    "020-05-16T14:47:00Z",
    "020-05-16T14:47:00.0Z",
    "020-05-16T14:47:00.00Z",
    "020-05-16T14:47:00.000Z",
    "020-05-16T14:47:00.0000Z",
    "020-05-16T14:47:00.00000Z",
    "020-05-16T14:47:00.000000Z",
    "020-05-16T14:47:00.0000000Z",
  ];
  const nonTimestampStrings = [
    ...malformedNowIsos,
    "",
    "rightparen",
    "This is not a Timestamp",
    "The smallest positive integer that cannot be described in twenty two syllables",
  ];
  const nonStrings = [undefined, null, true, false, 42, {}, []];
  const nonTimestamps = [...nonTimestampStrings, ...nonStrings];

  describe("toDate", () => {
    it("returns equivalent Date", () => {
      nowForms.forEach(x => expect(toDate(x)).toEqual(now));
    });
  });

  describe("isTimestamp", () => {
    it("accepts ISO timestamp", () => {
      nowIsos.forEach(x =>
        expect(`${x}: ${isTimestamp(x)}`).toEqual(`${x}: true`),
      );
    });
    it("rejects non-timestamps", () => {
      nonTimestamps.forEach(x =>
        expect(`${x}: ${isTimestamp(x)}`).toEqual(`${x}: false`),
      );
    });
  });

  describe("toTimestamp", () => {
    it("returns equivalient Timestamp", () => {
      nowForms.forEach(x => expect(toTimestamp(x)).toEqual(nowIso));
    });
  });

  describe("timestampOrNull", () => {
    it("returns valid timestamp", () => {
      nowIsos.forEach(x => expect(timestampOrNull(x)).toEqual(x));
    });
    it("returns null for non-timestamp strings", () => {
      nonTimestampStrings.forEach(x => expect(timestampOrNull(x)).toBeNull());
    });
  });

  describe("timestampOrThrow", () => {
    it("returns valid timestamp", () => {
      nowIsos.forEach(x => expect(timestampOrThrow(x)).toEqual(x));
    });
    it("returns null for non-timestamp strings", () => {
      nonTimestampStrings.forEach(x =>
        expect(() => timestampOrThrow(x)).toThrow(),
      );
    });
  });

  const numbers = [0, -1, 42, nowMs];
  const nonNumbers = [undefined, null, true, false, "", [], {}];

  describe("isDurationMs", () => {
    it("accepts numbers", () => {
      numbers.forEach(x =>
        expect(`${x}: ${isDurationMs(x)}`).toEqual(`${x}: true`),
      );
    });
    it("rejects non-numbers", () => {
      nonNumbers.forEach(x =>
        expect(`${x}: ${isDurationMs(x)}`).toEqual(`${x}: false`),
      );
    });
  });

  describe("durationMs", () => {
    it("converts trivial DurationSpec correctly", () => {
      expect(durationMs({ days: 2 })).toEqual(2 * DAY_MS);
      expect(durationMs({ hours: 3 })).toEqual(3 * HOUR_MS);
      expect(durationMs({ minutes: 4 })).toEqual(4 * MINUTE_MS);
      expect(durationMs({ seconds: 5 })).toEqual(5 * SECOND_MS);
      expect(durationMs({ ms: 6 })).toEqual(6);
    });
    it("converts negative DurationSpec correctly", () => {
      expect(durationMs({ days: -2 })).toEqual(-2 * DAY_MS);
      expect(durationMs({ hours: -3 })).toEqual(-3 * HOUR_MS);
      expect(durationMs({ minutes: -4 })).toEqual(-4 * MINUTE_MS);
      expect(durationMs({ seconds: -5 })).toEqual(-5 * SECOND_MS);
      expect(durationMs({ ms: -6 })).toEqual(-6);
    });
    it("converts mixed DurationSpec correctly", () => {
      expect(durationMs({ days: 2, hours: -3, minutes: 4 })).toEqual(
        2 * DAY_MS - 3 * HOUR_MS + 4 * MINUTE_MS,
      );
    });
  });

  describe("isEpochMs", () => {
    it("accepts numbers", () => {
      numbers.forEach(x =>
        expect(`${x}: ${isEpochMs(x)}`).toEqual(`${x}: true`),
      );
    });
    it("rejects non-numbers", () => {
      nonNumbers.forEach(x =>
        expect(`${x}: ${isEpochMs(x)}`).toEqual(`${x}: false`),
      );
    });
  });

  describe("toEpochMs", () => {
    it("returns equivalent EpochMs", () => {
      nowForms.forEach(x => expect(toEpochMs(x)).toEqual(nowMs));
    });
  });

  const { offset, between, sum, negate } = DurationCalc;
  const start = toEpochMs("2020-05-16T23:49:19.929Z");
  const end = toEpochMs("2020-05-16T23:49:32.704Z");
  const duration = (end - start) as DurationMs;
  const negDuration = (start - end) as DurationMs;

  describe("after", () => {
    it("adds", () => {
      expect(offset(start, duration)).toEqual(end);
      expect(offset(end, negDuration)).toEqual(start);
    });
  });

  describe("between", () => {
    it("subtracts", () => {
      expect(between(start, end)).toEqual(duration);
      expect(between(end, start)).toEqual(negDuration);
    });
  });

  describe("sum", () => {
    it("adds", () => {
      expect(sum(duration, negDuration)).toEqual(0);
    });
  });

  describe("negate", () => {
    it("negates durations", () => {
      expect(negate(duration)).toEqual(negDuration);
      expect(negate(negDuration)).toEqual(duration);
    });
  });

  const validDays = ["1001-01-01", "9999-12-31", "2020-05-16"];
  const invalidDayStrings = [
    "-1000-01-01",
    "2020-13-01",
    "2020-05-32",
    "20200-01-01",
    nowMonth,
    nowYear,
    "potato",
  ];

  describe("isDay", () => {
    it("accepts valid days", () => {
      validDays.forEach(x => expect(`${x}: ${isDay(x)}`).toEqual(`${x}: true`));
    });
    it("rejects invalid day input", () => {
      [...invalidDayStrings, ...nonStrings].forEach(x =>
        expect(`${x}: ${isDay(x)}`).toEqual(`${x}: false`),
      );
    });
  });

  describe("dayOrNull", () => {
    it("accepts valid days", () => {
      validDays.forEach(x => expect(dayOrNull(x)).toEqual(x));
    });
    it("rejects invalid day input", () => {
      invalidDayStrings.forEach(x => expect(dayOrNull(x)).toEqual(null));
    });
  });

  describe("dayOrThrow", () => {
    it("accepts valid days", () => {
      validDays.forEach(x => expect(dayOrThrow(x)).toEqual(x));
    });
    it("rejects invalid day input", () => {
      invalidDayStrings.forEach(x => expect(() => dayOrThrow(x)).toThrow());
    });
  });

  describe("toUtcDay", () => {
    it("converts different forms of Date", () => {
      nowForms.forEach(x => expect(toUtcDay(x)).toEqual(nowDay));
    });
  });

  const validMonths = ["1001-01", "9999-12", "2020-05"];
  const invalidMonthStrings = [
    "-1000-01",
    "2020-13",
    "20200-01",
    nowDay,
    nowYear,
    "tomato",
  ];

  describe("isMonth", () => {
    it("accepts valid months", () => {
      validMonths.forEach(x =>
        expect(`${x}: ${isMonth(x)}`).toEqual(`${x}: true`),
      );
    });
    it("rejects invalid month input", () => {
      [...invalidMonthStrings, ...nonStrings].forEach(x =>
        expect(`${x}: ${isMonth(x)}`).toEqual(`${x}: false`),
      );
    });
  });

  describe("monthOrNull", () => {
    it("accepts valid months", () => {
      validMonths.forEach(x => expect(monthOrNull(x)).toEqual(x));
    });
    it("rejects invalid month input", () => {
      invalidMonthStrings.forEach(x => expect(monthOrNull(x)).toEqual(null));
    });
  });

  describe("monthOrThrow", () => {
    it("accepts valid months", () => {
      validMonths.forEach(x => expect(monthOrThrow(x)).toEqual(x));
    });
    it("rejects invalid month input", () => {
      invalidMonthStrings.forEach(x => expect(() => monthOrThrow(x)).toThrow());
    });
  });

  describe("toUtcMonth", () => {
    it("converts different forms of Date", () => {
      nowForms.forEach(x => expect(toUtcMonth(x)).toEqual(nowMonth));
    });
  });

  const validYears = ["1001", "9999", "2020"];
  const invalidYearStrings = ["-1000", "20200", nowDay, nowMonth, "asparagus"];

  describe("isYear", () => {
    it("accepts valid years", () => {
      validYears.forEach(x =>
        expect(`${x}: ${isYear(x)}`).toEqual(`${x}: true`),
      );
    });
    it("rejects invalid year input", () => {
      [...invalidYearStrings, ...nonStrings].forEach(x =>
        expect(`${x}: ${isYear(x)}`).toEqual(`${x}: false`),
      );
    });
  });

  describe("yearOrNull", () => {
    it("accepts valid years", () => {
      validYears.forEach(x => expect(yearOrNull(x)).toEqual(x));
    });
    it("rejects invalid year input", () => {
      invalidYearStrings.forEach(x => expect(yearOrNull(x)).toEqual(null));
    });
  });

  describe("yearOrThrow", () => {
    it("accepts valid years", () => {
      validYears.forEach(x => expect(yearOrThrow(x)).toEqual(x));
    });
    it("rejects invalid year input", () => {
      invalidYearStrings.forEach(x => expect(() => yearOrThrow(x)).toThrow());
    });
  });

  describe("toUtcYear", () => {
    it("converts different forms of Date", () => {
      nowForms.forEach(x => expect(toUtcYear(x)).toEqual(nowYear));
    });
  });
});
