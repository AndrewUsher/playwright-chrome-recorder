import {
  LineWriter,
  Schema,
  StringifyExtension,
  StepType
} from '@puppeteer/replay'

import {
  SupportedRecorderKeysKeys,
  supportedRecorderKeys
} from './constants.js'

export class PlaywrightStringifyExtension extends StringifyExtension {
  async beforeAllSteps(out: LineWriter, flow: Schema.UserFlow): Promise<void> {
    out
      .appendLine(`test.describe(${formatAsJSLiteral(flow.title)}, () => {`)
      .startBlock()
    out
      .appendLine(
        `test(${formatAsJSLiteral(
          `tests ${flow.title}`
        )}, async ({ page }) => {`
      )
      .startBlock()
  }

  async afterAllSteps(out: LineWriter): Promise<void> {
    out.endBlock().appendLine('});')
    out.endBlock().appendLine('});')
  }

  async stringifyStep(
    out: LineWriter,
    step: Schema.Step,
    flow?: Schema.UserFlow
  ): Promise<void> {
    this.#appendStepType(out, step, flow)

    if (step.assertedEvents) {
      // TODO: handle assertions
    }
  }

  #appendStepType(
    out: LineWriter,
    step: Schema.Step,
    flow?: Schema.UserFlow
  ): void {
    switch (step.type) {
      case StepType.Click:
        return this.#appendClickStep(out, step, flow)
      case StepType.DoubleClick:
        return this.#appendDoubleClickStep(out, step, flow)
      case StepType.Change:
        return this.#appendChangeStep(out, step, flow)
      case StepType.SetViewport:
        return this.#appendViewportStep(out, step)
      case StepType.Scroll:
        return this.#appendScrollStep(out, step, flow)
      case StepType.Navigate:
        return this.#appendNavigationStep(out, step)
      case StepType.KeyDown:
        return this.#appendKeyDownStep(out, step)
      case StepType.Hover:
        return this.#appendHoverStep(out, step, flow)
    }
  }

  #appendChangeStep(
    out: LineWriter,
    step: Schema.ChangeStep,
    flow?: Schema.UserFlow
  ): void {
    const playwrightSelector = handleSelectors(step.selectors, flow)

    if (playwrightSelector) {
      out.appendLine(
        `${playwrightSelector}.type(${formatAsJSLiteral(step.value)});`
      )
    }
  }

  #appendClickStep(
    out: LineWriter,
    step: Schema.ClickStep,
    flow?: Schema.UserFlow
  ): void {
    const playwrightSelector = handleSelectors(step.selectors, flow)
    const hasRightClick = step.button && step.button === 'secondary'

    if (playwrightSelector) {
      if (hasRightClick) {
        out.appendLine(`${playwrightSelector}.click({
          button: 'right'
        })`)
      } else {
        out.appendLine(`${playwrightSelector}.click()`)
      }
    } else {
      console.log(
        `Warning: The click on ${step.selectors[0]} was not able to be exported to Playwright. Please adjust your selectors and try again.`
      )
    }

    if (step.assertedEvents) {
      step.assertedEvents.forEach((event) => {
        if (event.type === 'navigation') {
          out.appendLine(`expect(page.url()).toBe('${event.url}');`)
        }
      })
    }
  }

  #appendDoubleClickStep(
    out: LineWriter,
    step: Schema.DoubleClickStep,
    flow?: Schema.UserFlow
  ): void {
    const playwrightSelector = handleSelectors(step.selectors, flow)

    if (playwrightSelector) {
      out.appendLine(`${playwrightSelector}.dblclick();`)
    } else {
      console.log(
        `Warning: The click on ${step.selectors[0]} was not able to be exported to Playwright. Please adjust your selectors and try again.`,
        step.selectors
      )
    }
  }

  #appendHoverStep(
    out: LineWriter,
    step: Schema.HoverStep,
    flow?: Schema.UserFlow
  ): void {
    const playwrightSelector = handleSelectors(step.selectors, flow)

    if (playwrightSelector) {
      out.appendLine(`${playwrightSelector}.hover();`)
    }
  }

  #appendKeyDownStep(out: LineWriter, step: Schema.KeyDownStep): void {
    const pressedKey = step.key.toLowerCase() as SupportedRecorderKeysKeys

    if (pressedKey in supportedRecorderKeys) {
      const keyValue = supportedRecorderKeys[pressedKey]
      out.appendLine(
        `page.keyboard.down(${formatAsJSLiteral(`{${keyValue}}`)});`
      )
    }
  }

  #appendNavigationStep(out: LineWriter, step: Schema.NavigateStep): void {
    out.appendLine(`await page.goto(${formatAsJSLiteral(step.url)});`)
  }

  #appendScrollStep(
    out: LineWriter,
    step: Schema.ScrollStep,
    flow?: Schema.UserFlow
  ): void {
    if ('selectors' in step) {
      out.appendLine(
        `${handleSelectors(step.selectors, flow)}.scrollIntoViewIfNeeded();`
      )
    } else {
      out.appendLine(`await page.mouse.wheel(${step.x}, ${step.y});`)
    }
  }

  #appendViewportStep(out: LineWriter, step: Schema.SetViewportStep): void {
    out.appendLine(`await page.setViewportSize({
      width: ${step.width},
      height: ${step.height}
    })`)
  }
}

function formatAsJSLiteral(value: string) {
  return JSON.stringify(value)
}

function filterArrayByString(selectors: Schema.Selector[], value: string) {
  return selectors.filter((selector) =>
    value === 'aria/'
      ? !selector[0].includes(value)
      : selector[0].includes(value)
  )
}

function handleSelectors(
  selectors: Schema.Selector[],
  flow?: Schema.UserFlow
): string | undefined {
  const nonAriaSelectors = filterArrayByString(selectors, 'aria/')
  let preferredSelector

  // Give preference to user-specified selectors
  if (flow?.selectorAttribute) {
    preferredSelector = filterArrayByString(
      nonAriaSelectors,
      flow.selectorAttribute
    )
  }
  if (preferredSelector && preferredSelector[0]) {
    return `await page.locator(${formatAsJSLiteral(preferredSelector[0][0])})`
  } else {
    return `await page.locator(${formatAsJSLiteral(nonAriaSelectors[0][0])})`
  }
}
