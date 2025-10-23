declare module "vitest" {
  export type TestContext = Record<string, unknown>
  export type TestFunction = (context: TestContext) => void | Promise<void>

  export function describe(name: string, fn: () => void | Promise<void>): void
  export function it(name: string, fn: TestFunction): void
  export function test(name: string, fn: TestFunction): void
  export function beforeEach(fn: TestFunction): void
  export function afterEach(fn: TestFunction): void
  export function expect<T>(actual: T): Expectation<T>

  export interface Expectation<T> {
    toBe(expected: T): void
    toEqual(expected: unknown): void
    toMatchSnapshot(): void
    toBeTruthy(): void
    toBeFalsy(): void
    toBeDefined(): void
    toBeCloseTo(expected: number, precision?: number): void
  }
}

declare module "vitest/config" {
  export function defineConfig<TConfig>(config: TConfig): TConfig
}
