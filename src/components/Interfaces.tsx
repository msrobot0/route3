
export type TokenType = {
    token: string,
    balance: string
    has: boolean,
  }
  
  export type AccountType = {
    address: string,
    tokens: TokenType[]
  }
  