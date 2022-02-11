export interface BaseError {
  readonly validationError: boolean
  readonly throwable: unknown | undefined
}

export const ExceptionHandler = (throwable: unknown, validationError = false): BaseError => ({
  throwable,
  validationError,
})
