import { parse, stringify, stringifyStep, Schema } from '@puppeteer/replay'
import { PlaywrightStringifyExtension } from './PlaywrightStringifyExtension.js'

export function parseRecordingContent(
  recordingContent: string
): Schema.UserFlow {
  return parse(JSON.parse(recordingContent))
}

export async function stringifyParsedRecording(
  parsedRecording: Schema.UserFlow
): Promise<Promise<string> | undefined> {
  return await stringify(parsedRecording, {
    extension: new PlaywrightStringifyExtension()
  })
}

export async function stringifyParsedStep(step: Schema.Step): Promise<string> {
  return await stringifyStep(step, {
    extension: new PlaywrightStringifyExtension()
  })
}

export async function playwrightStringifyChromeRecording(
  recording: string
): Promise<string | undefined> {
  // If no recordings found, log message and return.
  if (recording.length === 0) {
    console.log(
      'No recordings found. Please create and upload one before trying again.'
    )

    return
  }

  const parsedRecording = parseRecordingContent(recording)

  const playwrightStringified = await stringifyParsedRecording(parsedRecording)

  return playwrightStringified
}
