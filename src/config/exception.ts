export interface BaseException {
  readonly validationError: boolean
  readonly throwable: unknown | undefined
}

export const ExceptionHandler = (throwable: unknown, validationError = false): BaseException => ({
  throwable,
  validationError,
})
