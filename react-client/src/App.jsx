import { useState, useEffect } from 'react';
import socket from './utilities/socketConnection';
import Widget from './perfDataComponents/Widget';
// import './App.css';

function App() {
  const [performanceData, setPErformanceData] = useState({});

  useEffect(() => {
    // socket was created on load of the component (line 3).
    // add a listener to that socket!
    socket.on('perfData', (data) => {
      // console.log(data);
      const copyPerfData = { ...performanceData };
      // performanceData is NOT an array. its an {}
      // this is because we don't know which machine just sent it's data
      // so we can use the macA of the machine as it's property in performanceData
      // every tick the data comes through, just overwrite that value
      copyPerfData[data.macA] = data;
      setPErformanceData(copyPerfData);
    });
  }, []); // run this once the component has rendered

  const widgets = Object.values(performanceData).map((d) => (
    <Widget data={d} key={d.macA} />
  ));

  return <div className="container">{widgets}</div>;
}

export default App;
