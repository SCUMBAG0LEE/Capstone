/**
 * A utility class to display non-blocking, temporary messages (success, error, info)
 * to the user.
 */
class MessageBox {
  static #container = null; // Static reference to the message box container

  /**
   * Initializes the message box container if it doesn't already exist.
   * This ensures there's a single point to append messages.
   */
  static _initContainer() {
    if (!MessageBox.#container) {
      MessageBox.#container = document.getElementById('message-box-container');
      if (!MessageBox.#container) {
        MessageBox.#container = document.createElement('div');
        MessageBox.#container.id = 'message-box-container';
        document.body.appendChild(MessageBox.#container);
      }
    }
  }

  /**
   * Displays a message to the user.
   * @param {string} message The text message to display.
   * @param {string} type The type of message ('success', 'error', 'info').
   * @param {number} duration The duration in milliseconds for the message to display. Defaults to 3000ms.
   */
  static show(message, type = 'info', duration = 3000) {
    MessageBox._initContainer(); // Ensure container exists

    const messageBox = document.createElement('div');
    messageBox.classList.add('message-box', type);
    messageBox.innerHTML = `
      <span>${message}</span>
      <button class="message-box-close">&times;</button>
    `;

    // Append the message box to the container
    MessageBox.#container.appendChild(messageBox);

    // Add event listener to close button
    messageBox.querySelector('.message-box-close').addEventListener('click', () => {
      MessageBox._removeMessage(messageBox);
    });

    // Automatically remove the message after the specified duration
    setTimeout(() => {
      MessageBox._removeMessage(messageBox);
    }, duration);
  }

  /**
   * Removes a specific message box from the DOM with a fade-out animation.
   * @param {HTMLElement} messageBox The message box element to remove.
   */
  static _removeMessage(messageBox) {
    if (messageBox && messageBox.parentNode === MessageBox.#container) {
      // Add a class to trigger fade-out animation
      messageBox.style.animation = 'fadeOutSlideUp 0.4s forwards';
      // Remove element from DOM after animation completes
      messageBox.addEventListener('animationend', () => {
        if (messageBox.parentNode) {
          messageBox.parentNode.removeChild(messageBox);
        }
      }, { once: true }); // Ensure the event listener runs only once
    }
  }
}

export default MessageBox;
