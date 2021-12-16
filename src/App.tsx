import Web3 from 'web3'
import Account from './components/Account';
import {AccountType, TokenType} from './components/Interfaces';
import './App.css';
import logo from './logo.svg'; 
import { useState } from 'react'
const abi  = require('human-standard-token-abi');
declare global {
  interface Window {
    ethereum?: any;
  }
}


const tokenAddresses = [{
  address: '0xd4f63a8aebb8b69165aa245a8ab103fc9fc9e706',
  token: 'MER'
}]

const IndexPage = () => {
  const [accounts, setAccounts] = useState<AccountType[]>([])
  const [web3Enabled, setWeb3Enabled] = useState(false)

  // Empty web3 instance
  
  let web3: Web3 = new Web3()

  const ethEnabled = async () => {

    if (typeof window.ethereum !== 'undefined') {
      web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.enable();

        return true
      } catch (e) {
        return false
      }

    }

    return false;
  }


  const onClickConnect = async () => {
    if (await !ethEnabled()) {
      alert("Please install MetaMask!");
    }

    setWeb3Enabled(true)

    var accs = await web3.eth.getAccounts();


    const newAccounts = await Promise.all(accs.map(async (address: string) => {
      const balance = await web3.eth.getBalance(address)
      
      const tokenBalances = await Promise.all(tokenAddresses.map(async (token) => {

        const tokenInst = new web3.eth.Contract(abi, token.address);
        
        const balance = await tokenInst.methods.balanceOf(address).call()

        return {
          token: token.token,
          has: balance > 0,
          balance:web3.utils.fromWei(balance, 'ether'),
        }
      }))

      return {
        address,
        tokens: tokenBalances
      }
    }))

    setAccounts(newAccounts)

  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        
         {!web3Enabled && <button onClick={onClickConnect}>Unlock</button>} Meredith's Vault
         {accounts && accounts.length > 0 && <div className="accounts">
         {accounts.map((account) => {
          return (
            <div className="account" key={account.address}>
              <Account account={account} />
            </div>
          )
          })}
             
          </div>
          }
      </header>
    </div>
  );
}

export default IndexPage;
