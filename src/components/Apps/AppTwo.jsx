import { useProvideContext } from '../../contexts/Context';
import Control from '../Control/Control';
import FormTwo from '../FormTwo';

const AppTwo = () => {
  const { ioAssignmentGrps, aoAssignmentGrps } = useProvideContext();
  return (
    <div>
      <FormTwo
        ioAssignmentGrps={ioAssignmentGrps}
        aoAssignmentGrps={aoAssignmentGrps}
      />
      <Control />
    </div>
  );
};

export default AppTwo;