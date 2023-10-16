import React from 'react';
import Switch from 'react-bootstrap/esm/Switch';
import { FaHeart, FaBars } from 'react-icons/fa';
import CardLayout from './components/cardLayout/CardLayout';

export default function Main(props) {
  return (
    <main>
      <div className="btn-toggle" onClick={() => props.handleToggleSidebar(true)}>
        <FaBars />
      </div>
      <CardLayout></CardLayout>
      {props.childElement}
    </main>
  );
};
