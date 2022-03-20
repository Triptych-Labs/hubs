import uuid from "uuid/v4";

export default class AuthChannel {
  constructor(store) {
    this.store = store;
    this.socket = null;
    this._signedIn = !!this.store.state.credentials.token;
    this._authLink = null;
  }

  setSocket = socket => {
    this.socket = socket;
  };

  get email() {
    return this.store.state.credentials.email;
  }

  get authLink() {
    return this._authLink;
  }

  get signedIn() {
    return this._signedIn;
  }

  signOut = async hubChannel => {
    if (hubChannel) {
      await hubChannel.signOut();
    }
    this.store.update({ credentials: { token: null, email: null } });
    await this.store.resetToRandomDefaultAvatar();
    this._signedIn = false;
  };

  verifyAuthentication(authTopic, authToken, authPayload) {
    const channel = this.socket.channel(authTopic);
    return new Promise((resolve, reject) => {
      channel.onError(() => {
        channel.leave();
        reject();
      });

      channel
        .join()
        .receive("ok", () => {
          channel.on("auth_credentials", async ({ credentials: token, payload: payload }) => {
            await this.handleAuthCredentials(payload.email, token);
            resolve();
          });

          channel.push("auth_verified", { token: authToken, payload: authPayload });
        })
        .receive("error", reject);
    });
  }

  async startAuthentication(email) {
    const channel = this.socket.channel(`auth:${uuid()}`);
    await new Promise((resolve, reject) =>
      channel
        .join()
        .receive("ok", resolve)
        .receive("error", reject)
    );

    // wait for auth link from phoenix since we do not use email but wish for users to confirm
    // registration by two-step generate -then-> affirm registration.
    const authLink = new Promise(resolve =>
      channel.on("auth_link", async ({ link }) => {
        await this.handleAuthLink(link);
        resolve();
      })
    );
    channel.push("auth_request", { email, origin: "hubs" });
    await authLink;
  }

  async handleAuthLink(authLink) {
    this.store.update({ credentials: { authLink } });
    this._authLink = authLink;
  }

  async handleAuthCredentials(email, token, hubChannel) {
    this.store.update({ credentials: { email, token } });

    if (hubChannel) {
      await hubChannel.signIn(token);
    }

    this._signedIn = true;
  }
}
