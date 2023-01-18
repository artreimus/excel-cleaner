import React from 'react';

const AppTwo = () => {
  const { ioAssignmentGrps, aoAssignmentGrps } = useProvideContext();
  return (
    <div>
      <Form 
        ioAssignmentGrps={ioAssignmentGrps}
        aoAssignmentGrps={aoAssignmentGrps}
      />
      <Control />
    </div>
  );
};

export default Form_2;