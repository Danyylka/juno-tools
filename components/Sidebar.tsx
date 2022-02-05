import { useCallback, useEffect, useState } from 'react'
import { useWallet } from 'contexts/wallet'
import type { NextPage } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ImArrowUpRight2 } from 'react-icons/im'
import { FiMoon, FiSun, FiBox } from 'react-icons/fi'
import { BiWallet } from 'react-icons/bi'
import { useTheme } from 'contexts/theme'
import getShortAddress from 'utils/getShortAddress'
import { loadKeplrWallet, useKeplr } from 'services/keplr'
import { useRouter } from 'next/router'
import { getConfig } from 'config'

const Sidebar: NextPage = () => {
  const router = useRouter()
  const theme = useTheme()
  const wallet = useWallet()
  const keplr = useKeplr()

  const activeColor = theme.isDarkTheme ? 'bg-purple/25' : 'bg-purple/10'
  const walletText = wallet.initialized
    ? wallet.name || getShortAddress(wallet.address)
    : 'Connect Wallet'

  const [networkSwitch, setNetworkSwitch] = useState(false)

  const changeThemeOnClick = () => {
    theme.setIsDarkTheme(!theme.isDarkTheme)
  }

  useEffect(() => {
    // Used for listening keplr account changes
    window.addEventListener('keplr_keystorechange', () => {
      keplr.connect(true)
    })
  }, [])

  const connectWallet = useCallback(() => keplr.connect(), [keplr])

  const walletOnClick = () => {
    if (wallet.initialized) {
      keplr.disconnect()
    } else {
      connectWallet()
    }
  }

  const networkOnChange = async (isMainnet: boolean) => {
    const network = isMainnet ? 'mainnet' : 'testnet'
    wallet.setNetwork(network)
    setNetworkSwitch(isMainnet)
    if (wallet.initialized) {
      const signer = await loadKeplrWallet(getConfig(network))
      wallet.updateSigner(signer)
    }
  }

  if (wallet.initialized) console.log(wallet.getClient())

  return (
    <div
      className={`min-w-[250px] h-full border-r-2 pt-5 pb-10 px-5 flex flex-col ${
        theme.isDarkTheme && 'bg-dark'
      } ${theme.isDarkTheme ? 'text-gray/75' : 'text-dark-gray/75'}
      ${theme.isDarkTheme ? 'border-gray/20' : 'border-dark/20'}
      `}
    >
      <Link href="/" passHref>
        <button className="flex w-13 rounded-full items-center">
          <Image
            src="/juno_logo.png"
            alt="logo"
            width={50}
            height={50}
            className="rounded-full"
          />
          <span
            className={`${
              theme.isDarkTheme ? 'text-gray/75' : 'text-dark-gray/75'
            } text-2xl ml-2`}
          >
            JunoTools
          </span>
        </button>
      </Link>

      <button
        onClick={walletOnClick}
        className={`${
          theme.isDarkTheme ? 'bg-gray/10' : 'bg-dark-gray/10'
        } w-full h-14 flex items-center rounded-lg p-2 my-5`}
      >
        {keplr.initializing ? (
          <div className="flex items-center justify-center w-full">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900" />
          </div>
        ) : (
          <>
            <BiWallet className="mr-2" size={24} /> {walletText}
          </>
        )}
      </button>

      <button onClick={() => networkOnChange(!networkSwitch)}>
        <div className="flex items-center w-full justify-evenly">
          <span>Testnet</span>
          <input
            type="checkbox"
            checked={networkSwitch}
            className="toggle"
            onChange={(e) => networkOnChange(e.currentTarget.checked)}
          />
          <span>Mainnet</span>
        </div>
      </button>

      <div className="mt-5">
        <Link href="/contracts/cw20" passHref>
          <button className="text-left">
            <div className="mb-4 mono-font">CW20 Contracts (Soon..)</div>
          </button>
        </Link>
        {/* <div className="mb-5">
          <Link href="/contracts/cw20-base" passHref>
            <button
              className={`flex items-center mb-1 w-full p-2 rounded-lg ${
                router.pathname.includes('/contracts/cw20-base')
                  ? activeColor
                  : ''
              }`}
            >
              <FiBox className="mr-2" /> Base
            </button>
          </Link>
          <Link href="/contracts/cw20-bonding" passHref>
            <button
              className={`flex items-center mb-1 w-full p-2 rounded-lg ${
                router.pathname.includes('/contracts/cw20-bonding')
                  ? activeColor
                  : ''
              }`}
            >
              <FiBox className="mr-2" /> Bonding
            </button>
          </Link>
          <Link href="/contracts/cw20-staking" passHref>
            <button
              className={`flex items-center mb-1 w-full p-2 rounded-lg ${
                router.pathname.includes('/contracts/cw20-staking')
                  ? activeColor
                  : ''
              }`}
            >
              <FiBox className="mr-2" /> Staking
            </button>
          </Link>
        </div> */}

        <div /* className="my-5" */>
          <Link href="/contracts/cw1" passHref>
            <button className="text-left">
              <div className="mb-4 mono-font">CW1 Contracts (Soon...)</div>
            </button>
          </Link>

          {/* <div className="mb-5">
            <Link href="/contracts/cw1-subkeys" passHref>
              <button
                className={`flex items-center mb-1 w-full p-2 rounded-lg ${
                  router.pathname.includes('/contracts/cw1-subkeys')
                    ? activeColor
                    : ''
                }`}
              >
                <FiBox className="mr-2" /> Subkeys
              </button>
            </Link>
          </div> */}
        </div>

        <Link href="/airdrops" passHref>
          <button className="text-left">
            <div className="mono-font">Airdrop Tokens</div>
          </button>
        </Link>
      </div>

      <div className="flex-1"></div>

      <div className="mb-3 mono-font">JunoTools v0.1.0-beta</div>
      <div className="ml-3">
        <button className="flex items-center" onClick={changeThemeOnClick}>
          {theme.isDarkTheme ? (
            <>
              <FiSun className="mr-2" /> Light Theme
            </>
          ) : (
            <>
              <FiMoon className="mr-2" /> Night Theme
            </>
          )}
        </button>
        <a href="https://www.junonetwork.io/" target="_blank" rel="noreferrer">
          <button className="flex items-center my-3">
            <ImArrowUpRight2 className="mr-2" /> Powered by Juno
          </button>
        </a>
        <a href="https://deuslabs.fi" target="_blank" rel="noreferrer">
          <button className="flex items-center">
            <ImArrowUpRight2 className="mr-2" /> Made by deus labs
          </button>
        </a>
      </div>
    </div>
  )
}

export default Sidebar
