import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';

export const SidebarData = [
  {
    title: 'Home',
    path: '/',
    icon: <AiIcons.AiFillHome />,
    cName: 'nav-text'
  },
  {
    title: 'Finanças',
    path: '/financial',
    icon: <IoIcons.IoIosPaper />,
    cName: 'nav-text'
  },
  {
    title: 'Dívidas',
    path: '/debts',
    icon: <FaIcons.FaCartPlus />,
    cName: 'nav-text'
  },
  {
    title: 'Cartões',
    path: '/cards',
    icon: <IoIcons.IoMdCard />,
    cName: 'nav-text'
  },
  {
    title: 'Carteira',
    path: '/wallet',
    icon: <FaIcons.FaWallet />,
    cName: 'nav-text'
  }
];