import {
  Children,
  FunctionComponent,
  PropsWithChildren,
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react'
import {
  createDefaultState,
  createWeb3State,
  loadContract,
  Web3State,
} from './utils'
import { ethers } from 'ethers'
import { MetaMaskInpageProvider } from '@metamask/providers'
import { NftMarketContract } from '@_types/nftMarketContract'

const pageReload = () => {
  window.location.reload()
}

const handleAccountChange =
   (ethereum: MetaMaskInpageProvider) => async () => {
    var isLocked = !(await ethereum._metamask.isUnlocked())
    if (isLocked) {
      pageReload()
    }
  }

//Detect Chain Changes
const setGlobalListeners =  (ethereum: MetaMaskInpageProvider) => {
  ethereum.on('chainChanged', pageReload)
  ethereum.on('accountsChanged', handleAccountChange(ethereum))
}

const removeGlobalListeners = (ethereum: MetaMaskInpageProvider) => {
  ethereum?.removeListener('chainChanged', pageReload)
  ethereum?.removeListener('accountsChanged', handleAccountChange(ethereum))
}

const Web3Context = createContext<Web3State>(createDefaultState())

const Web3Provider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [web3API, setWeb3API] = useState<Web3State>(createDefaultState())
  useEffect(() => {
    async function initWeb3() {
      try {
        const provider = new ethers.providers.Web3Provider(
          window.ethereum as any
        )
        const contract = await loadContract('NFTMarket', provider)

        const signer = provider.getSigner()
        const signedContract = contract.connect(signer)

        setGlobalListeners(window.ethereum)

        setWeb3API(
          createWeb3State({
            ethereum: window.ethereum,
            provider,
            contract: signedContract as unknown as NftMarketContract,
            isLoading: false,
          })
        )
      } catch (e) {
        console.error('Please install Web3 Wallet')
        setWeb3API((api) =>
          createWeb3State({
            ...(api as any),
            isLoading: false,
          })
        )
      }
    }

    initWeb3()
    return () => removeGlobalListeners(window.ethereum)
  }, [])

  return <Web3Context.Provider value={web3API}>{children}</Web3Context.Provider>
}

export const useWeb3 = () => {
  return useContext(Web3Context)
}

export const useHooks = () => {
  const { hooks } = useWeb3()
  return hooks
}

export default Web3Provider
