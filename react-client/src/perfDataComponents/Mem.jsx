import { useRef } from 'react';
import drawCircle from '../utilities/canvasLoadAnimation';

const Mem = ({ data }) => {
  const { freeMem, memUsage, totalMem, usedMem } = data;
  const memRef = useRef();
  const totalMemInGB = Math.floor((totalMem / 1073741824) * 100) / 100;
  const freeMemInGB = Math.floor((freeMem / 1073741824) * 100) / 100;

  drawCircle(memRef.current, usedMem);
  return (
    <div className="mem col-3">
      <h3>CPU Load {data.cpuLoad}</h3>
      <div className="canvas-wrapper">
        <canvas ref={memRef} className="" width="200" height="200"></canvas>
        <div className="mem-text">{memUsage}%</div>
      </div>
      <div>Total Memory: {totalMemInGB} gb</div>
      <div>Free Memory: {freeMemInGB} gb</div>
    </div>
  );
};

export default Mem;
