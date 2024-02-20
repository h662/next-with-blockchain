"use client";

import { User } from "@prisma/client";
import axios from "axios";
import Image from "next/image";
import { FC, useState } from "react";

const Header: FC = () => {
  const [user, setUser] = useState<User>();

  const onMetaMask = async () => {
    try {
      if (!window.ethereum) return;

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const response = await axios.post<User>(
        `${process.env.NEXT_PUBLIC_URL}/api/user`,
        {
          account: accounts[0],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setUser(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header className="flex justify-end py-2">
      {user ? (
        <div className="flex gap-2">
          <Image
            src={`/images/${user.profileImage}`}
            alt={user.nickname}
            width={24}
            height={24}
          />
          <div className="w-24 truncate">{user.nickname}</div>
        </div>
      ) : (
        <button onClick={onMetaMask}>🦊 MetaMask</button>
      )}
    </header>
  );
};

export default Header;
