import {LitElement, html} from '@polymer/lit-element';

class InstagramAuthButton extends LitElement {

  static get properties() {
    return {
      label: {type: String},
      status: {type: String},
    };
  }

  constructor() {
    super();
    this.label = 'Sign in with Instagram';
    this.status = 'logged out';
    this.addEventListener('click', this._signIn);
  }

  render() {
    return html`
    <style>
    /* button */
    span {

    }
    /* icon */
    span:before {

    }
    </style>
    <span>${this.label}</span>
    `;
  }

  async _signIn() {
    this.label = 'Signing in ...';
    this.status = 'signing in';
    await this.updateComplete;
    this.dispatchEvent(new CustomEvent('signin', {
      detail: {status: this.status}
    }));
  }

}

customElements.define('instagram-auth-button', InstagramAuthButton);
