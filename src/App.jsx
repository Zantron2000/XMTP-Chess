import { mainnet } from 'wagmi/chains';
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'
import { WagmiConfig } from "wagmi";

import './App.css'
import SSXWatchProvider from './components/SSXWatchProvider';
import SSXLogin from './components/middleware/SSXLogin';
import XMTPLogin from './components/middleware/XMTPLogin';
import Tester from './components/Tester';
import { XMTPProvider } from '@xmtp/react-sdk';

const projectId = import.meta.env.VITE_PROJECT_ID;
const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}
const chains = [mainnet]
const wagmiConfig = defaultWagmiConfig({
  chains, projectId, metadata, themeMode: 'dark', themeVariables: {
    '--w3m-accent	': '#000000',
    '--w3m-color-mix': '#00BB7F',
    '--w3m-color-mix-strength': 40
  }
})
createWeb3Modal({ wagmiConfig, projectId, chains })

function App() {
  return (
    <WagmiConfig config={wagmiConfig}>
      <SSXWatchProvider>
        <XMTPProvider>
          <SSXLogin>
            <XMTPLogin>
              <Tester />
            </XMTPLogin>
          </SSXLogin>
        </XMTPProvider>
      </SSXWatchProvider>
    </WagmiConfig>
  )
}

export default App
