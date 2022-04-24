import './App.css';
//Bring in the required hooks and possible wallet states
import { useWallet, WalletStatus } from "@terra-money/wallet-provider";
// Here's the new import for the file we just added
import Menu from './components/Menu';
//App.js
import './loader.js'
// Import it first
import WalletAddress from './components/WalletAddress';


function App() {
    // Current wallet status, connect & disconnect functions, available connections
    const { status, connect, disconnect, availableConnectTypes } = useWallet();

    // Let's take a look at what the starting states are!
    console.log("Wallet status is ", status);
    console.log("Available connection types:", availableConnectTypes);

    const renderConnectButton = () => {
        if (status === WalletStatus.WALLET_NOT_CONNECTED) {
            return (
                <div className="connect-wallet-div">
                    <button
                        type="button"
                        key={`connect-EXTENSION`}
                        onClick={() => connect("EXTENSION")}
                        className="cta-button connect-wallet-button"
                    >
                        Connect wallet
                    </button>
                </div>
            );
        }  else if (status === WalletStatus.WALLET_CONNECTED) {
            return (
                <button
                    type="button"
                    onClick={() => disconnect()}
                    className="cta-button connect-wallet-button"
                >
                    Disconnect
                </button>
            );
        }
    };

    // Nothing changes here :D
    return (
        <main className="App">
            <header>
                <div className="header-titles">
                    <h1>⚔ Walkers War ⚔</h1>
                    <p>Only you can save us from Walker town</p>
                </div>
                <WalletAddress />
            </header>

            {/* If not connected, show the walker GIF! */}
            {status === WalletStatus.WALLET_NOT_CONNECTED && (
                <div>
                    <img
                        src="https://media.giphy.com/media/qU7oOpEOsdRYc/giphy.gif"
                        alt="Walkers gif" />
                </div>
            )}

            {/* Show the menu after connection */}
            {status === WalletStatus.WALLET_CONNECTED && (
                <div className="game-menu-container">
                    <Menu />
                </div>
            )}

            {renderConnectButton()}
        </main>
    );
}

export default App;