/**
 * SendGrid API Configuration
 *
 */

module.exports.sendgrid = {
  apiKey: process.env.SENDGRID_API_KEY,
  fromEmail: process.env.SENDGRID_FROM_EMAIL,
  fromName: process.env.SENDGRID_FROM_NAME,
}
