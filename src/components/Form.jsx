import { useState, useCallback, useEffect } from 'react';
import { utils, writeFileXLSX, read } from 'xlsx';

const testIOAssignmentGroupOptions = {
  'Service Desk': 'Service Desk',
  'Service Mgmt': 'Service Mgmt',
  'Data Center-Windows': 'Cloud',
  'Data Center-Backups': 'Cloud',
  'Cloud-Administrators': 'Cloud',
  L3_BUMA_Workplace: 'L3 BUMA',
  L3_BUMA_Network: 'L3 BUMA',
  'Networks-Operations': 'Networks',
  'Workplace-Desktop': 'Workplace',
  'Workplace-Collaboration': 'Workplace',
  'Workplace-Messaging': 'Workplace',
};

const testAOAssignmentGroupOptions = {
  'SAP ERP - Supply Chain (MM/PO)': 'SAP SC',
  'SAP ERP - Basis': 'SAP Basis',
  'SAP ERP - Security': 'SAP Security',
  'SAP ERP - Asset Management': 'SAP AM',
  'SAP ERP - Finance (FI/CO)': 'SAP Finance',
  'L3_BUMA_Non-ERP_Applications': 'L3 Non ERP',
  'SAP ERP -  Concur': 'SAP Concur',
  'Enhancement/ABAP': 'Enhancement',
  'BUMA Safety': 'BUMA Safety',
  Integration: 'Integration',
  'Employee Central': 'Employee Central',
};

const testHeaders = [
  'Number',
  'Opened',
  'Date',
  'Actual elapsed',
  'Elapsed',
  'Priority',
  'State',
  'Short description',
  'Group',
  'Tower',
  'Channel',
  'Task type',
  'Categorization',
  'Updated',
  'Week',
  'Untouched elapsed',
  'Assigned to',
  'Remarks',
];

const testIOAssignmentGroups = [
  'Data Center-Windows',
  'Workplace-Desktop',
  'Workplace-Collaboration',
  'Workplace-Messaging',
  'L3_BUMA_Workplace',
  'L3_BUMA_Network',
  'Networks-Operations',
  'Cloud-Administrators',
  'Service Desk',
  'Service Mgmt',
  'Service Mgmt-Configuration',
];

const testAOAssignmentGroups = [
  'SAP ERP - Supply Chain (MM/PO)',
  'SAP ERP - Basis',
  'SAP ERP - Security',
  'SAP ERP - Asset Management',
  'SAP ERP - Finance (FI/CO)',
  'SAP ERP -  Concur',
  'L3_BUMA_Non-ERP_Applications',
  'Enhancement/ABAP',
  'BUMA Safety',
  'Integration',
  'Employee Central',
];

const Form = () => {
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
    filterData(testIOAssignmentGroups, testAOAssignmentGroups);
  }, [data]);

  function renameAssignmentGroup(group, options) {
    return options[group] ?? group;
  }

  function filterData(IOAssignmentGroups, AOAssignmentGroups) {
    const arrIO = [];
    const arrAO = [];
    const arrNoGrp = [];

    data.forEach((ticket) => {
      const assignmentGrp = ticket['Assignment group'];
      if (IOAssignmentGroups.includes(assignmentGrp)) {
        arrIO.push(formatRowData(ticket));
      } else if (AOAssignmentGroups.includes(assignmentGrp)) {
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

    const assignmentGroup = renameAssignmentGroup(
      obj['Assignment group'],
      testIOAssignmentGroupOptions
    );

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
      header: [...testHeaders],
    });
    const aoSheet = utils.json_to_sheet(AOData, {
      header: [...testHeaders],
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
