import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'

import { Account } from './components'

export function App() {
  const { isConnected } = useAccount()
  return (
    <div className='p-4 m-auto w-min'>
      <h1 className='text-2xl font-bold' >wagmi + RainbowKit + Vite</h1>

      <ConnectButton />
      {isConnected && <Account />}
    </div>
  )
}
