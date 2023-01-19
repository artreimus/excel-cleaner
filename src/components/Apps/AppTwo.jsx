import { useProvideContext } from '../../contexts/Context';
import Control from '../Control/Control';
import Form from '../FormTwo';

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

export default AppTwo;