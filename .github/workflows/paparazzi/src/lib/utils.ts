/* eslint-disable no-console */

/**
 * Silly utilities, mostly for logging.
 */

export default class Printer {
  header = (text: string): void => {
    console.log('')
    console.log(
      '-----------------------------------------------------------------------'
    )
    console.log(`${text}`)
    console.log(
      '-----------------------------------------------------------------------'
    )
  }

  subheader = (text: string): void => {
    console.log('')
    console.log(`${text}`)
    console.log(
      '-----------------------------------------------------------------------'
    )
  }

  download = (text: string): void => {
    console.log(`  └ ⬇️  ${text}`)
  }

  capture = (text: string): void => {
    console.log(`  └ 🏙  ${text}`)
  }

  compare = (text: string): void => {
    console.log(`  └ 🎆  ${text}`)
  }
}
