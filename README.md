![cute animal nomming on carrot](nomnomnom.jpg)

# Nominal Date Types

A library of TypeScript types related to Javascript Date.

The types add type safety to various strings and numbers used to serialize or calculate with Date values.
This provides support for conversion and validation, but only minimal support for calculation.

This library has no runtime dependencies.

## DateLike

This is a union type of built-in representations of a moment in time.
It includes `Date`, `number` of milliseconds since UNIX epoch, and `string` ISO timestamps.

### toDateUTC(x: DateLike): Date

Returns or constructs a `Date` object from `DateLike`.

## Timestamp

This is a type for `string`s obtained from `Date.toISOString()`.

### isTimestamp(x: any): x is Timestamp

Type-guard for `x` being a valid `string` representing a `Timestamp`.

### nowTimestamp(): Timestamp

Returns a `Timestamp` representing the current moment in time.

### timestampOrNull(x: string): Timestamp | null

Returns `x` if it represents a valid `Timestamp` string, `null` otherwise.

### timestampOrThrow(x: string): Timestamp

Returns `x` if it represents a valid `Timestamp` string, and throws otherwise.

### toTimestamp(x: DateLike): Timestamp

Converts a valid `DateLike` to `Timestamp`.

## DurationMs

DurationMs is a type for `number`s that represents duration as a number of milliseconds.

### isDurationMs(x: any): x is DurationMs

Type-guard for `x` being a valid `number` that represents a `DurationMs`.
Succeeds for any `number`.

### durationMs(spec: DurationSpec): DurationMs

Returns a `DurationMs` given a `DurationSpec`:

```
export interface DurationSpec {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  ms?: number;
}
```

Negative values are supported.

## EpochMs

`EpochMs` is a type for `number`s that represents a number of milliseconds since the UNIX epoch (midnight, Jan 1, 1970, UTC).
This has the same semantics as `Date.now()`.

### isEpochMs(x: any): x is EpochMs

Type-guard for `x` being a valid `number` that represents an `EpochMs`.
Succeeds for any `number`.

### nowEpochMs(): EpochMs

Returns an `EpochMs` representing the current moment in time.

### toEpochMs(x: DateLike): EpochMs

Converts a valid `DateLike` to `EpochMs`.

## DurationCalc

A namespace of functions for calculating with `DurationMs` and `EpochMs`.

### offset(base: EpochMs, duration: DurationMs): EpochMs

Returns `base + duration`, works for negative values.

### between(start: EpochMs, end: EpochMs): DurationMs

Returns `end - start`, works for negative values.
Note the order is opposite subtraction--if the earlier `EpochMs` comes first the result is positive.

### sum(...durations: DurationMs[]): DurationMs

Returns the sum of zero or more `DurationMs`.

### negate(duration: DurationMs): DurationMs

Negates a `DurationMs`.

### max<T extends DurationMs | EpochMs>(...xs: T[]): T

Returns the maximum of `DurationMs`s or `EpochMs`s.
Note, arguments must all be of the same type.

### min<T extends DurationMs | EpochMs>(...xs: T[]): T

Returns the minimum of `DurationMs`s or `EpochMs`s.
Note, arguments must all be of the same type.

## CalendarDay

`CalendarDay` is a type for `string`s that represents a particular calendar day in the form "YYYY-MM-DD".
It is a goal that this type be sortable, so values are restricted to positive years with 4 digits.

### MIN_DATE: Timestamp

A `Timestamp` representing the earliest valid `CalendarDay`.

### MAX_DATE: Timestamp

A `Timestamp` representing the latest valid `CalendarDay`.

### MIN_EPOCH_MS: EpochMs

An `EpochMs` representing the earliest valid `CalendarDay`.

### MAX_EPOCH_MS: EpochMs

An `EpochMs` representing the latest valid `CalendarDay`.

### clampEpochMs(ms: number): EpochMs

For use in date calculations via `EpochMs` and `DurationMs`.
Returns an `EpochMs` between `MIN_EPOCH_MS` and `MAX_EPOCH_MS` inclusive that represents the closest `EpochMs` that falls in the range of valid `CalendarDay`s.

### isDay(x: any): x is CalendarDay

Type-guard for `x` being a valid `string` that represents a `CalendarDay`.

### dayOrNull(x: string): CalendarDay | null

Returns `x` if it represents a valid `CalendarDay` string, `null` otherwise.

### dayOrThrow(x: string): CalendarDay

Returns `x` if it represents a valid `CalendarDay` string, and throws otherwise.

### toUtcDay(x: DateLike): CalendarDay

Converts a valid `DateLike` to `CalendarDay`.

## CalendarMonth and CalendarYear

Experimental.
These have the same semantics as `CalendarDay` except for month and year respectively, and support the same set of functions.
