import {LitElement, html} from '@polymer/lit-element';

/**
 * Applying the "implicit" method only: it's less secure, but does not require
 * a backend to perform the sign in
 * Official documentation: https://www.instagram.com/developer/authentication/
 */
class InstagramAuthButton extends LitElement {

  static get properties() {
    return {
      clientId: {
        attribute: 'client-id',
        type: String,
      },
      redirectUri: {
        attribute: 'redirect-uri',
        type: String,
      },
      token: {
        attribute: false,
        type: String,
      },
      label: {type: String},
      status: {type: String},
    };
  }

  constructor() {
    super();
    if (window.location.hash.indexOf('#access_token=') !== -1) {
      this.token = window.location.hash.substring('#access_token='.length-1);
      this.label = 'Signed in';
      this.status = 'logged in';
      this.dispatchEvent(new CustomEvent('signin', {
        detail: {status: this.status}
      }));
    } else {
      this.label = 'Sign in with Instagram';
      this.status = 'logged out';
      this.addEventListener('click', this._signIn);
    }
  }

  render() {
    return html`
    <style>
    * {
      box-sizing: border-box;
    }
    /* some padding to improve click experience */
    :host {
      padding: 3px;
    }
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
    // pre sign-in process
    if (!this._verifyParameters()) {
      return;
    }
    this.label = 'Signing in ...';
    this.status = 'signing in';
    await this.updateComplete;
    this.dispatchEvent(new CustomEvent('signin', {
      detail: {status: this.status}
    }));
    // start sign-in process
    this._redirectToLogin();
  }

  /**
   * Verify if the required paremeters have been defined
   * @return {Boolean}
   */
  _verifyParameters() {
    return typeof this.clientId === 'string'
      && typeof this.redirectUri === 'string'
      && this.clientId.length > 0
      && this.redirectUri.length > 0;
  }

  /**
   * Redirect to Instagram login screen
   */
  _redirectToLogin() {
    const BASE = `https://api.instagram.com/oauth/authorize/`
    const PARAMS = [
      `client_id=${this.clientId}`,
      `redirect_uri=${this.redirectUri}`,
      `response_type=token`
    ].join('&');
    window.location.href = `${BASE}?${PARAMS}`
  }

}

customElements.define('instagram-auth-button', InstagramAuthButton);
