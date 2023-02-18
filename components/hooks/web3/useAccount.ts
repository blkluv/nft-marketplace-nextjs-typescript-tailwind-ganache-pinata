import { CryptoHookFactory } from '@_types/hooks'
import { useEffect } from 'react'
import useSWR from 'swr'

type AccountHookFactory = CryptoHookFactory<string, UseAccountResponse>

export type UseAccountHook = ReturnType<AccountHookFactory>

type UseAccountResponse = {
  connect: () => void,
  isLoading: boolean,
  isInstalled: boolean
}
//deps -> provider, ethereum, contract
export const hookFactory: AccountHookFactory =
  ({ provider, ethereum, isLoading }) =>
  () => {
    const {mutate, data, isValidating, ...swrRes} = useSWR(
      provider ? 'web3/useAccount' : null,
      async () => {
        const accounts = await provider!.listAccounts()
        const account = accounts[0]
        if (!account) {
          throw 'Cannot retrieve account! Connect to Web3 wallet '
        }
        return account
      },
      {
        revalidateOnFocus: false,
      }
    )

    useEffect(() => {
      ethereum?.on('accountsChanged', handleAccountsChanged)
      return () => {
        ethereum?.removeListener('accountsChanged', handleAccountsChanged)
      }
    })

    const handleAccountsChanged = (...args: unknown[]) => {
      const accounts = args[0] as string[]
      if(accounts.length === 0){
        console.error("Please connnect to Web3 Wallet")
      }
      else if(accounts[0] !== data){
          mutate(accounts[0])
      }
    }

    const connect = async () => {
      try {
        ethereum?.request({ method: 'eth_requestAccounts' })
      } catch (e) {
        console.error(e)
      }
    }

    return { ...swrRes, connect, mutate, data, isValidating, isLoading: isLoading as boolean, isInstalled: ethereum?.isMetaMask || false }
  }
