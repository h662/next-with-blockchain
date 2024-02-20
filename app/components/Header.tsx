"use client";

import { FC, useState } from "react";

const Header: FC = () => {
  const [account, setAccount] = useState<string>("");

  const onMetaMask = async () => {
    try {
      const accounts = await window.ethereum?.request({
        method: "eth_requestAccounts",
      });

      setAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header className="flex justify-end">
      {account ? (
        <div>
          {account.substring(0, 7)}...{account.substring(account.length - 5)}
        </div>
      ) : (
        <button onClick={onMetaMask}>🦊 MetaMask</button>
      )}
    </header>
  );
};

export default Header;
