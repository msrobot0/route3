import Web3 from 'web3'
import Account from './components/Account';
import {AccountType, TokenType} from './components/Interfaces';
import './App.css';
import logo from './logo.svg'; 
import { useState,useEffect } from 'react'
import { getAllByPlaceholderText } from '@testing-library/react';
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

const abi  = require('human-standard-token-abi');
declare global {
  interface Window {
    ethereum?: any;
  }
}




Sentry.init({
  dsn: "https://9fbe65b9ddd940488e6a0b17a5a6ffcf@o1093430.ingest.sentry.io/6112695",
  integrations: [new Integrations.BrowserTracing()],

});



const tokenAddresses = [{
  address: '0xd4f63a8aebb8b69165aa245a8ab103fc9fc9e706',
  token: 'MER'
}]

const IndexPage = () => {
  const [accounts, setAccounts] = useState<AccountType[]>([])
  const [web3Enabled, setWeb3Enabled] = useState(false)
  const [metamask, setMetamask] = useState(true)
  const [message, setMessage] = useState("");
  const [acct, setAcct] = useState<String[]>([]);
  // Empty web3 instance

  let web3: Web3 = new Web3()

  const ethEnabled = async () => {

    if (typeof window.ethereum !== 'undefined') {
      web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.enable();

        return true;
      } catch (e) {
        
        return false
      }

    }

    return false;
  }

  window.ethereum.on('accountsChanged', function () {
    onClickConnect();

  });

  useEffect(() => {
    if (acct.length ==0 ){
      onClickConnect();
    }
  });

  const onClickConnect = async () => {
    if (await !ethEnabled()) {
      //setMessage("Please install Metamask.io inorder to use this page.")
      //setMetamask(false);
    }
    
    setWeb3Enabled(true);
    
   // await window.ethereum.enable();
    //const id = await window.ethereum.request({ method: 'eth_chainId' });

    var accs = await web3.eth.getAccounts();
    setAcct(accs);
    const newAccounts = await Promise.all(accs.map(async (address: string) => {
      const balance = await web3.eth.getBalance(address)
      
      const tokenBalances = await Promise.all(tokenAddresses.map(async (token) => {

        const tokenInst = new web3.eth.Contract(abi, token.address);
        
        const balance = await tokenInst.methods.balanceOf(address).call()
        let b = web3.utils.fromWei(balance, 'ether');
        Sentry.captureMessage(new Date()+"User:"+address+",balance:"+b);
        
        return {
          token: token.token,
          has: balance > 0,
          balance:b,
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
        {!metamask && <div>{message}</div> }
         {!web3Enabled && <div><button onClick={onClickConnect}>Unlock</button></div>} <div>Meredith's Vault</div>
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
