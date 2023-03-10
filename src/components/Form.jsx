import { useState, useCallback, useEffect } from 'react';
import { utils, writeFileXLSX, read } from 'xlsx';
import Headers from '../Config/Headers';

const Form = ({ ioAssignmentGrps, aoAssignmentGrps }) => {
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
    } = obj;

    let today = new Date();
    Opened = new Date(Opened);
    Updated = new Date(Updated);
    
    const actualElapsedInDays = Math.floor(
      (today.getTime() - Opened.getTime()) / (24 * 3600 * 1000)
    );

    const untouchedElapsedInDays = Math.floor(
      (today.getTime() - Updated.getTime()) / (24 * 3600 * 1000)
    );

    today = today.toLocaleDateString('en-US');
    Opened = Opened.toLocaleDateString('en-US');
    Updated = Updated.toLocaleDateString('en-US');

    let Elapsed = '';

    if (actualElapsedInDays < 7) {
      Elapsed = '< 7 Days';
    } else if (actualElapsedInDays <= 14) {
      Elapsed = '1-2 weeks';
    } else if (actualElapsedInDays <= 28) {
      Elapsed = '2-4 weeks';
    } else {
      Elapsed = '> 1 month';
    }

    const assignmentGroup = renameAssignmentGroup(obj['Assignment group']);

    return {
      'Short description': obj['Short description'],
      'Task type': 'Incident',
      'Assigned to': obj['Assigned to'],
      Number,
      Opened,
      Date: today,
      'Actual elapsed': actualElapsedInDays,
      Elapsed,
      Group: assignmentGroup,
      Tower: assignmentGroup,
      Priority,
      State,
      Channel,
      Categorization,
      Updated,
      Remarks,
      'Untouched elapsed': untouchedElapsedInDays,
    };
  }

  const exportFile = useCallback(() => {
    const workBook = utils.book_new();
    const rawSheet = utils.json_to_sheet(data);
    const ioSheet = utils.json_to_sheet(IOData, {
      header: [...Headers],
    });
    const aoSheet = utils.json_to_sheet(AOData, {
      header: [...Headers],
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

export default Form;