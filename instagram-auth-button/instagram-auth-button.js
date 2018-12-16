import {LitElement, html} from '@polymer/lit-element';

/**
 * Applying the "implicit" method only: it's less secure, but does not require
 * a backend to perform the sign in
 * Official documentation: https://www.instagram.com/developer/authentication/
 */
class InstagramAuthButton extends LitElement {

  static get properties() {
    return {
      strictMode: {
        attribute: 'strict-mode',
        type: Boolean,
      },
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
    @import url('https://fonts.googleapis.com/css?family=Roboto');
    /* some padding to improve click experience */
    :host {
      display: inline-block;
      font-family: var(--font-family, 'Roboto', sans-serif);
      cursor: pointer;
    }
    /* button */
    span {
      position: relative;
      display: inline-block;
      vertical-align: middle;
      color: #FFF;
      background: #333;
      line-height: 59.5px;
      padding-right: 10px;
    }
    /* icon */
    svg {
      display: inline-block;
      vertical-align: middle;
      background: #444;
      width: 30px;
      height: 30px;
      min-width: 29px;
      min-height: 29px;
      padding: 15px;
      margin-right: 10px;
    }
    path, circle {
      fill: #FFF;
    }
    </style>
    <span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    	<path d="M256,49.471c67.266,0,75.233.257,101.8,1.469,24.562,1.121,37.9,5.224,46.778,8.674a78.052,78.052,0,0,1,28.966,18.845,78.052,78.052,0,0,1,18.845,28.966c3.45,8.877,7.554,22.216,8.674,46.778,1.212,26.565,1.469,34.532,1.469,101.8s-0.257,75.233-1.469,101.8c-1.121,24.562-5.225,37.9-8.674,46.778a83.427,83.427,0,0,1-47.811,47.811c-8.877,3.45-22.216,7.554-46.778,8.674-26.56,1.212-34.527,1.469-101.8,1.469s-75.237-.257-101.8-1.469c-24.562-1.121-37.9-5.225-46.778-8.674a78.051,78.051,0,0,1-28.966-18.845,78.053,78.053,0,0,1-18.845-28.966c-3.45-8.877-7.554-22.216-8.674-46.778-1.212-26.564-1.469-34.532-1.469-101.8s0.257-75.233,1.469-101.8c1.121-24.562,5.224-37.9,8.674-46.778A78.052,78.052,0,0,1,78.458,78.458a78.053,78.053,0,0,1,28.966-18.845c8.877-3.45,22.216-7.554,46.778-8.674,26.565-1.212,34.532-1.469,101.8-1.469m0-45.391c-68.418,0-77,.29-103.866,1.516-26.815,1.224-45.127,5.482-61.151,11.71a123.488,123.488,0,0,0-44.62,29.057A123.488,123.488,0,0,0,17.3,90.982C11.077,107.007,6.819,125.319,5.6,152.134,4.369,179,4.079,187.582,4.079,256S4.369,333,5.6,359.866c1.224,26.815,5.482,45.127,11.71,61.151a123.489,123.489,0,0,0,29.057,44.62,123.486,123.486,0,0,0,44.62,29.057c16.025,6.228,34.337,10.486,61.151,11.71,26.87,1.226,35.449,1.516,103.866,1.516s77-.29,103.866-1.516c26.815-1.224,45.127-5.482,61.151-11.71a128.817,128.817,0,0,0,73.677-73.677c6.228-16.025,10.486-34.337,11.71-61.151,1.226-26.87,1.516-35.449,1.516-103.866s-0.29-77-1.516-103.866c-1.224-26.815-5.482-45.127-11.71-61.151a123.486,123.486,0,0,0-29.057-44.62A123.487,123.487,0,0,0,421.018,17.3C404.993,11.077,386.681,6.819,359.866,5.6,333,4.369,324.418,4.079,256,4.079h0Z"/>
    	<path d="M256,126.635A129.365,129.365,0,1,0,385.365,256,129.365,129.365,0,0,0,256,126.635Zm0,213.338A83.973,83.973,0,1,1,339.974,256,83.974,83.974,0,0,1,256,339.973Z"/>
    	<circle cx="390.476" cy="121.524" r="30.23"/>
    </svg>${this.label}</span>
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
    // warning for developers
    if (!this.strictMode) {
      console.warn(`
        ****************
        SECURITY WARNING
        The current set sign in flow is Client-Side (Implicit) Authentication
        If you wish to change to Server-Side (Explicit) mode please use the
          <... strict-mode="true" ...></...>
        attribute. More details about Authentication flows and security at:
          https://www.instagram.com/developer/authentication/
        ****************
      `);
    }
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
      `response_type=${this.strictMode ? 'code' : 'token'}`
    ].join('&');
    window.location.href = `${BASE}?${PARAMS}`
  }

  /**
   * Expose Access Token
   * @return {String}
   */
  accessToken() {
    return this.token
  }

}

customElements.define('instagram-auth-button', InstagramAuthButton);
