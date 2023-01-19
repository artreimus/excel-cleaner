import { useState, useCallback, useEffect } from 'react';
import { utils, writeFileXLSX, read } from 'xlsx';
import HeadersTwo from '../Config/HeadersTwo';

const FormTwo = ({ ioAssignmentGrps, aoAssignmentGrps }) => {
  const [file, setFile] = useState();
  const [data, setData] = useState([]);
  const [IOData, setIOData] = useState([]);
  const [AOData, setAOData] = useState([]);
  const [noGrpData, setNoGrpData] = useState([]);

  useEffect(() => {
    const readData = async () => {
      if (file) {
        const wb = read(await file.arrayBuffer());
        setData(
          utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { raw: false })
        );
      }
    };
    readData();
  }, [file]);

  useEffect(() => {
    filterData(Object.keys(ioAssignmentGrps), Object.keys(aoAssignmentGrps));
  }, [data, ioAssignmentGrps, aoAssignmentGrps]);

  function renameAssignmentGroup(group) {
    const newName = ioAssignmentGrps[group] ?? aoAssignmentGrps[group] ?? group;
    return newName;
  }

  function filterData(ioGrp, aoGrp) {
    const arrIO = [];
    const arrAO = [];
    const arrNoGrp = [];

    data.forEach((ticket) => {
      const assignmentGrp = ticket['Assignment group'];
      if (ioGrp.includes(assignmentGrp)) {
        arrIO.push(formatRowData(ticket));
      } else if (aoGrp.includes(assignmentGrp)) {
        arrAO.push(formatRowData(ticket));
      } else {
        arrNoGrp.push(ticket);
      }
    });

    setIOData(arrIO);
    setAOData(arrAO);
    setNoGrpData(arrNoGrp);
  }

  function formatRowData(obj) {
    let {
      Number,
      Opened,
      Priority,
      State,
      Channel,
      Categorization,
      Remarks = '',
      Updated,
      Location,
      Resolved
    } = obj;

    let today = new Date();
    Updated = new Date(Updated);
    Opened = new Date(Opened);
    Resolved = new Date(Resolved);

    let openedWeekdate = new Date();
    let openedDayNumber = Opened.getDay() || 7;

    let resolvedWeekdate = new Date();
    let resolvedDayNumber = Resolved.getDay() || 7;


    if(openedDayNumber !== 1)              
      openedWeekdate.setHours(-24 * (openedDayNumber - 1));

    if(resolvedDayNumber !== 1)              
      resolvedWeekdate.setHours(-24 * (resolvedDayNumber - 1));
    
    let resolvedTime = obj['Resolve time'];

    let d = Math.floor(resolvedTime / (3600*24));
    let h = Math.floor(resolvedTime % (3600*24) / 3600);
    let m = Math.floor(resolvedTime % 3600 / 60);
    let s = Math.floor(resolvedTime % 60);    

    const TTR = (
      d + ":" + h + ":" + m + ":" + s 
    );

    //let openedWeek = Opened.getDate() - (Opened.getDay() + (Opened.getDay() == 0 ? -6:1));
    //let resolvedWeek = Resolved.getDate() - (Resolved.getDay() + (Resolved.getDay() == 0 ? -6:1))
    
    /*openedWeekdate.setDate(Opened.getDate() - (Opened.getDay() + (Opened.getDay() == 0 ? -6:1)))
    resolvedWeekdate.setDate(Resolved.getDate() - (Resolved.getDay() + (Resolved.getDay() == 0 ? -6:1)))*/
    
    today = today.toLocaleDateString('en-US');
    Opened = Opened.toLocaleDateString('en-US');
    Updated = Updated.toLocaleDateString('en-US');
    

    /*let openedWeekdate = new Date(openedWeekdate)
    let resolvedWeekdate = new Date(resolvedWeekdate)

    openedWeekdate = openedWeekdate.setDate(openedWeek);
    resolvedWeekdate = resolvedWeekdate.setDate(resolvedWeek);*/

    const assignmentGroup = renameAssignmentGroup(obj['Assignment group']);

    return {
      Number,
      Opened,
      'Week Opened': openedWeekdate, 
      Priority,
      State,
      'Short description': obj['Short description'],
      Group: assignmentGroup,
      Tower: assignmentGroup,
      Channel,
      'Task type': 'Incident',
      Categorization,
      Location,
      Resolved,
      'Week Resolved': resolvedWeekdate,
      'Resolve Time': obj['Resolve time'],
      TTR,
      Remarks,
    };
  }

  const exportFile = useCallback(() => {
    const workBook = utils.book_new();
    const rawSheet = utils.json_to_sheet(data);
    const ioSheet = utils.json_to_sheet(IOData, {
      header: [...HeadersTwo],
    });
    const aoSheet = utils.json_to_sheet(AOData, {
      header: [...HeadersTwo],
    });
    const noGrpSheet = utils.json_to_sheet(noGrpData);
    utils.book_append_sheet(workBook, rawSheet, 'PinakaRaw');
    utils.book_append_sheet(workBook, ioSheet, 'IO Raw');
    utils.book_append_sheet(workBook, aoSheet, 'AO Raw');
    utils.book_append_sheet(workBook, noGrpSheet, 'No Group Sheet');
    writeFileXLSX(workBook, 'Report.xlsx');
  }, [data, IOData, AOData]);

  function handleFileChange(e) {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    exportFile();
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="excel-file" className="form__label">
        Choose Excel File
      </label>
      <input
        type="file"
        id="excel-file"
        name="excel-file"
        className="hidden"
        onChange={handleFileChange}
      />
      {file && (
        <>
          <div className="form__info">
            <p> {`File : ${file.name}`} </p>
          </div>
          <button className="form__btn">Submit</button>
        </>
      )}
    </form>
  );
};

export default FormTwo;
