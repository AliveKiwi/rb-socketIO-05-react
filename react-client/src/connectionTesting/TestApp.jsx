import { useEffect } from 'react';
import socket from '../socketConnection';
import SecondTest from './SecondTest';

const TestApp = () => {
  useEffect(() => {
    socket.emit('testConnection', 'Am I connected?');
  }, []);

  return (
    <>
      <h1>Test App</h1>;
      <SecondTest />
    </>
  );
};

export default TestApp;
