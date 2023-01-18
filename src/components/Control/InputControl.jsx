import React from 'react';

const InputControl = ({ id, removeNum, input, setInputs }) => {
  function onAssignGrpChange(e) {
    setInputs((prev) => {
      return { ...prev, [id]: { ...input, assignmentGrp: e.target.value } };
    });
  }

  function onNewGrpChange(e) {
    setInputs((prev) => {
      return { ...prev, [id]: { ...input, newGrp: e.target.value } };
    });
  }

  function onFilterGrpChange(e) {
    setInputs((prev) => {
      return { ...prev, [id]: { ...input, filterGrp: e.target.value } };
    });
  }

  return (
    <div
      className={`input-grp ${
        input.filterGrp === 'ao'
          ? 'input-grp--io'
          : input.filterGrp === 'io'
          ? 'input-grp--ao'
          : ''
      }`}
    >
      <label htmlFor="assignGrp">Assignment Group</label>
      <input
        type="text"
        id="assignGrp"
        name="assignGrp"
        onChange={onAssignGrpChange}
        value={input.assignmentGrp}
        required
      />
      <label htmlFor="newGrp">Convert to</label>
      <input
        type="text"
        id="newGrp"
        name="newGrp"
        onChange={onNewGrpChange}
        value={input.newGrp}
        required
      />
      <label htmlFor="filterGrp">Group</label>
      <select
        name="filterGrp"
        id="filterGrp"
        value={input.filterGrp}
        onChange={onFilterGrpChange}
      >
        <option value="">---</option>
        <option value="ao">AO</option>
        <option value="io">IO</option>
      </select>
      <button onClick={() => removeNum(id)}>Delete</button>
    </div>
  );
};

export default InputControl;
