/**
 * Logs a message to the console if it is available.
 *
 * @param {String} msg The message to log.
 */
function log(msg) {
  if (window.console && console.log) {
    console.log(msg)
  }
}
