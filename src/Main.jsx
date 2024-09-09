import React from 'react';
import Switch from 'react-bootstrap/esm/Switch';
import { FaHeart, FaBars } from 'react-icons/fa';
import CardLayout from './components/cardLayout/CardLayout';
import './Main.css'

export default function Main(props) {
  return (
    <main className='mainLayout'>
      <CardLayout></CardLayout>
      {props.childElement}
    </main>
  );
};
