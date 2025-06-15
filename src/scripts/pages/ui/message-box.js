/**
 * A utility class to display non-blocking, temporary messages (success, error, info)
 * to the user.
 */
class MessageBox {
  static #container = null; // Static reference to the message box container
  static #isConfirmActive = false; // Static flag to track if a confirmation box is active

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
   * Displays a confirmation message to the user with Yes/No buttons.
   * @param {string} message The text message to display.
   * @param {string} type The type of message (e.g., 'confirm').
   * @returns {Promise<boolean>} A promise that resolves to true if confirmed, false otherwise.
   */
  static showConfirm(message, type = 'confirm', timeout = 3000) {
  return new Promise((resolve) => {
    if (MessageBox.#isConfirmActive) {
      resolve(false);
      return;
    }

    MessageBox._initContainer();
    MessageBox.#isConfirmActive = true;

    const messageBox = document.createElement('div');
    messageBox.classList.add('message-box', type, 'confirm-box');
    messageBox.innerHTML = `<span>${message}</span><div class="confirm-buttons"><button class="confirm-yes">Yes</button><button class="confirm-no">No</button></div>`;
    MessageBox.#container.appendChild(messageBox);


    // Timeout to auto-dismiss if no response
    const autoDismiss = setTimeout(() => {
      cleanup(false);
    }, timeout);

    const cleanup = (result) => {
  clearTimeout(autoDismiss); // Cancel timeout
  
  // Move this line BEFORE animation to allow new confirmations during fade-out
  MessageBox.#isConfirmActive = false;

  MessageBox._removeMessage(messageBox, () => {
    resolve(result);
  });
};


    messageBox.querySelector('.confirm-yes').addEventListener('click', () => cleanup(true));
    messageBox.querySelector('.confirm-no').addEventListener('click', () => cleanup(false));
  });
}

  /**
   * Removes a specific message box from the DOM with a fade-out animation.
   * @param {HTMLElement} messageBox The message box element to remove.
   * @param {function} [callback] An optional callback function to execute after removal.
   */
  static _removeMessage(messageBox, callback = null) {
    if (messageBox && messageBox.parentNode === MessageBox.#container) {
      messageBox.style.animation = 'fadeOutSlideUp 0.4s forwards';
      messageBox.addEventListener('animationend', () => {
        if (messageBox.parentNode) {
          messageBox.parentNode.removeChild(messageBox);
          if (callback) {
            callback(); // Execute callback after removal
          }
        }
      }, { once: true });
    } else if (callback) {
      // If messageBox is not in container (e.g., already removed), call callback immediately
      callback();
    }
  }
}

export default MessageBox;
