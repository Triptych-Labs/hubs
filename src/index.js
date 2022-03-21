import React, { useMemo } from "react";
import ReactDOM from "react-dom";
import { WrappedIntlProvider } from "./react-components/wrapped-intl-provider";
import registerTelemetry from "./telemetry";
import Store from "./storage/store";
import "./utils/theme";
import { HomePage } from "./react-components/home/HomePage";
import { AuthContextProvider } from "./react-components/auth/AuthContext";
import "./react-components/styles/global.scss";
import { ThemeProvider } from "./react-components/styles/theme";

registerTelemetry("/home", "Hubs Home Page");

const store = new Store();
window.APP = { store };

function Root() {
  /*
import { clusterApiUrl } from "@solana/web3.js";

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

import { getPhantomWallet, getSolflareWallet } from "@solana/wallet-adapter-wallets";

import { WalletProvider, ConnectionProvider } from "@solana/wallet-adapter-react";
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(() => [getPhantomWallet(), getSolflareWallet()], [network]);
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets}>
      </WalletProvider>
    </ConnectionProvider>
   * */
  return (
    <WrappedIntlProvider>
      <ThemeProvider store={store}>
        <AuthContextProvider store={store}>
          <HomePage />
        </AuthContextProvider>
      </ThemeProvider>
    </WrappedIntlProvider>
  );
}

ReactDOM.render(<Root />, document.getElementById("home-root"));
