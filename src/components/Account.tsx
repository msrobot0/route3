import React from 'react'
import {AccountType, TokenType} from './Interfaces';


type PropTypes = {
  account: AccountType
}

export default function Account({
  account
}: PropTypes) {
  return (
    <>
     
     
        <div className="tokens">
          {account.tokens.map(token => {
            if (token.has) {
            return (
              <div className="token" key={token.token}>
                <div className="balance">
                  <div className="balance-value">
                  Congrats! You have {token.balance} super secret Mer tokens.
                  
                  </div>
                  <a href="https://www.systempoetics.com/91c5100a-ecdf-4a66-b20c-62a078f63182">Proceed.</a>
                </div>
              </div>

            )
            }else{
              return (
                <div className="token" key={token.token}>
                  <div className="balance">
                    <div className="balance-value">
                    In order to proceed you need some Mer tokens.
                    </div>
                   You dont have any. You can get some from  <a href="https://www.sushi.com/">Sushi Swap</a> I think.
                  </div>
                </div>
  
              ) 
            }
          })}
        </div>
        <div className="account">
        <div className="address">
          <small>FYI this is for wallet: {account.address}</small>
        </div>
      </div>
    </>
  )
}