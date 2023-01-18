import { useEffect, useState } from 'react';
import InputControl from './InputControl';
import uniqid from 'uniqid';
import {
  AOAssignmentGroupOptions,
  IOAssignmentGroupOptions,
} from '../../Config/OptionsGrps';
import { useProvideContext } from '../../contexts/Context';

const Control = () => {
  const [inputs, setInputs] = useState({});
  const [ids, setIds] = useState([]);

  const { setIOAssignmentGrps, setAOAssignmentGrps } = useProvideContext();

  function addNum() {
    const id = uniqid();
    const inputInterface = {
      [id]: { assignmentGrp: '', newGrp: '', filterGrp: '' },
    };
    setIds((prev) => [...prev, id]);
    setInputs((prev) => ({ ...prev, ...inputInterface }));
  }

  function removeNum(id) {
    setIds((prev) => prev.filter((prevId) => prevId !== id));
    setInputs((prev) => {
      delete prev[id];
      return prev;
    });
  }

  useEffect(() => {
    function objectMap() {
      const tempIds = [];
      let tempInputs = {};

      Object.keys(AOAssignmentGroupOptions).forEach((key) => {
        const id = uniqid();
        const inputInterface = {
          [id]: {
            assignmentGrp: key,
            newGrp: AOAssignmentGroupOptions[key],
            filterGrp: 'ao',
          },
        };

        tempIds.push(id);
        tempInputs = { ...tempInputs, ...inputInterface };
      });

      Object.keys(IOAssignmentGroupOptions).forEach((key) => {
        const id = uniqid();
        const inputInterface = {
          [id]: {
            assignmentGrp: key,
            newGrp: IOAssignmentGroupOptions[key],
            filterGrp: 'io',
          },
        };

        tempIds.push(id);
        tempInputs = { ...tempInputs, ...inputInterface };
      });

      setInputs((prev) => ({ ...tempInputs }));
      setIds((prev) => [...tempIds]);
    }
    objectMap();
  }, []);

  useEffect(() => {
    let ioAssignOptions = {};
    let aoAssignOptions = {};
    let noAssignOptions = {};

    ids.forEach((id) => {
      const input = inputs[id];

      if (input.filterGrp === 'ao') {
        aoAssignOptions = {
          ...aoAssignOptions,
          [input.assignmentGrp]: input.newGrp,
        };
      } else if (input.filterGrp === 'io') {
        ioAssignOptions = {
          ...ioAssignOptions,
          [input.assignmentGrp]: input.newGrp,
        };
      } else {
        noAssignOptions = {
          ...noAssignOptions,
          [input.assignmentGrp]: input.newGrp,
        };
      }
    });

    setAOAssignmentGrps(aoAssignOptions);
    setIOAssignmentGrps(ioAssignOptions);
  }, [ids, inputs]);

  return (
    <div className="control">
      <div className="control__header">
        <h2 className="control__title">Control</h2>
        <button onClick={addNum} className="control__btn">
          Add Input
        </button>
      </div>
      <div className="control__container--inputs">
        {ids.map((id) => (
          <InputControl
            key={id}
            id={id}
            input={inputs[id]}
            setInputs={setInputs}
            removeNum={removeNum}
          />
        ))}
      </div>
    </div>
  );
};

export default Control;
