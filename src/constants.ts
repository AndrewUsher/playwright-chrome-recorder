export type RecorderChangeTypes =
  | 'textarea'
  | 'select-one'
  | 'text'
  | 'url'
  | 'tel'
  | 'search'
  | 'password'
  | 'number'
  | 'email'

export const recorderChangeTypes: RecorderChangeTypes[] = [
  'textarea',
  'select-one',
  'text',
  'url',
  'tel',
  'search',
  'password',
  'number',
  'email'
]

export type SupportedRecorderKeysKeys =
  | 'backspace'
  | 'enter'
  | 'arrowUp'
  | 'arrowDown'
  | 'arrowLeft'
  | 'arrowRight'
  | 'escape'
  | 'pageUp'
  | 'pageDown'
  | 'end'
  | 'home'
  | 'insert'

type SupportedRecorderKeysValues =
  | 'Backspace'
  | 'Enter'
  | 'ArrowUp'
  | 'ArrowDown'
  | 'ArrowLeft'
  | 'ArrowRight'
  | 'Escape'
  | 'PageUp'
  | 'PageDown'
  | 'End'
  | 'Home'
  | 'Insert'

type SupportedRecorderKeys = {
  [key in SupportedRecorderKeysKeys]: SupportedRecorderKeysValues
}

export const supportedRecorderKeys: SupportedRecorderKeys = {
  backspace: 'Backspace',
  enter: 'Enter',
  arrowUp: 'ArrowUp',
  arrowDown: 'ArrowDown',
  arrowLeft: 'ArrowLeft',
  arrowRight: 'ArrowRight',
  escape: 'Escape',
  pageUp: 'PageUp',
  pageDown: 'PageDown',
  end: 'End',
  home: 'Home',
  insert: 'Insert'
}

export const defaultOutputFolder = 'playwright'
