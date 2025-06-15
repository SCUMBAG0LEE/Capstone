/**
 * A utility class to display non-blocking, temporary messages (success, error, info)
 * to the user.
 */
class MessageBox {
  static #container = null; // Static reference to the message box container

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

  static show(message, type = 'info', duration = 3000) {
    MessageBox._initContainer();
    const messageBox = document.createElement('div');
    messageBox.classList.add('message-box', type);
    messageBox.innerHTML = `
      <span>${message}</span>
      <button class="message-box-close">&times;</button>
    `;

    MessageBox.#container.appendChild(messageBox);

    messageBox.querySelector('.message-box-close').addEventListener('click', () => {
      MessageBox._removeMessage(messageBox);
    });

    setTimeout(() => {
      MessageBox._removeMessage(messageBox);
    }, duration);
  }

  static showConfirm(message, type = 'confirm', timeout = 3000) {
    return new Promise((resolve) => {
      MessageBox._initContainer();
      const existingConfirm = document.getElementById('message-box-confirm');
      if (existingConfirm) {
        resolve(false);
        return;
      }

      const messageBox = document.createElement('div');
      messageBox.id = 'message-box-confirm';
      messageBox.classList.add('message-box', type, 'confirm-box');
      messageBox.innerHTML = `
        <span>${message}</span>
        <div class="confirm-buttons">
          <button class="confirm-yes">Yes</button>
          <button class="confirm-no">No</button>
        </div>`;

      MessageBox.#container.appendChild(messageBox);

      const autoDismiss = setTimeout(() => {
        cleanup(false);
      }, timeout);

      const cleanup = (result) => {
        clearTimeout(autoDismiss);
        MessageBox._removeMessage(messageBox, () => {
          resolve(result);
        });
      };

      messageBox.querySelector('.confirm-yes').addEventListener('click', () => {
        cleanup(true);
      });
      messageBox.querySelector('.confirm-no').addEventListener('click', () => {
        cleanup(false);
      });
    });
  }

  static _removeMessage(messageBox, callback = null) {
    if (!messageBox || messageBox.parentNode !== MessageBox.#container) {
      if (callback) callback();
      return;
    }

    messageBox.classList.add('removing');
    messageBox.style.animation = 'fadeOutSlideUp 0.4s forwards';

    const removeNode = () => {
      if (messageBox.parentNode === MessageBox.#container) {
        MessageBox.#container.removeChild(messageBox);
      }
      if (callback) callback();
    };

    // Ensure animationend always gets called
    messageBox.addEventListener('animationend', removeNode, { once: true });
    // Fallback in case animationend doesn't fire
    setTimeout(removeNode, 500);
  }
}

export default MessageBox;
