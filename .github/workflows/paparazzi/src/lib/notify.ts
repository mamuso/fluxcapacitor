import {Config} from './types'
import sgMail from '@sendgrid/mail'

export default class Notify {
  config
  apikey: any = process.env.SENDGRID_API_KEY

  constructor(config: Config) {
    this.config = {...config} as Config
  }

  /**
   * Compress folder.
   */
  send = async () => {
    try {
      await sgMail.setApiKey(this.apikey)
      const msg = {
        to: 'mamuso@github.com',
        from: 'mamuso@github.com',
        subject: 'Sending with Twilio SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>'
      }

      // await sgMail.send(msg)
    } catch (e) {
      throw e
    }
  }
}
