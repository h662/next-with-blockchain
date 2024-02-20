"use client";

import { User } from "@prisma/client";
import axios from "axios";
import Image from "next/image";
import { FC, FormEvent, useState } from "react";

const Header: FC = () => {
  const [user, setUser] = useState<User>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [nickname, setNickname] = useState<string>("");

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

  const onModalOpen = () => {
    setIsOpen(true);
  };

  const onModalClose = () => {
    setIsOpen(false);
  };

  const onUpdateNickname = async (e: FormEvent) => {
    try {
      e.preventDefault();

      if (!user) return;

      const response = await axios.put<User>(
        `${process.env.NEXT_PUBLIC_URL}/api/user`,
        {
          account: user.account,
          nickname,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setUser(response.data);
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <header className="flex justify-end py-2">
        {user ? (
          <div className="flex gap-2">
            <Image
              src={`/images/${user.profileImage}`}
              alt={user.nickname}
              width={24}
              height={24}
            />
            <button className="w-24 text-left truncate" onClick={onModalOpen}>
              {user.nickname}
            </button>
          </div>
        ) : (
          <button onClick={onMetaMask}>🦊 MetaMask</button>
        )}
      </header>
      {isOpen && (
        <div className="bg-white bg-opacity-50 fixed top-0 left-0 w-full h-full flex justify-center items-center">
          <form
            className="bg-gray-100 p-2 flex flex-col"
            onSubmit={onUpdateNickname}
          >
            <button className="self-end mb-4" onClick={onModalClose}>
              x
            </button>
            <input
              className="mb-2"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
            <input type="submit" />
          </form>
        </div>
      )}
    </>
  );
};

export default Header;
