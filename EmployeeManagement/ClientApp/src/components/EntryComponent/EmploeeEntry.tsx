import React, { useEffect, useState } from "react";
import DateFnsUtils from "@date-io/date-fns";
import _ from "lodash";
import Grid from "@material-ui/core/Grid";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import "date-fns";
import { Button } from "@material-ui/core";
import { withStyles, Theme, createStyles } from "@material-ui/core/styles";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  GetAuthUserEntryDetails,
  IEmployeeEntryDetails,
  AddNewEntry,
  AddOutTime,
  AddBreak,
  UpdateBreak,
  IBreak,
} from "../../APIs/EmployeeEntry.API";
import EmployeeRow from "./EmployeeRow";
import "../../custom.css";

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  })
)(TableCell);

function EmploeeEntry() {
  const [todayDate, setTodayDate] = useState<Date>(new Date());
  const [inTime, setInTime] = useState<Date>(new Date());
  const [outTime, setOutTime] = useState<Date | null>(null);
  const [employeeEntries, setEmployeeEntries] =
    useState<IEmployeeEntryDetails[]>();
  const [breaks, setBreaks] = useState<IBreak[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function GetDetails() {
    await GetAuthUserEntryDetails().then((entries) => {
      setEmployeeEntries([...entries]);
    });
  }
  useEffect(() => {
    GetDetails();
  }, []);

  return (
    <div>
      <div>
        <h1>Entry</h1>
      </div>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container justify="space-around">
          <KeyboardDatePicker
            margin="normal"
            id="date-picker-dialog"
            label="Select Date"
            format="MM/dd/yyyy"
            value={new Date()}
            onChange={(date, value) => {}}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
            showTodayButton={true}
            readOnly={true}
          />
          <KeyboardTimePicker
            margin="normal"
            id="in-time-picker"
            label="In Time"
            value={inTime}
            onChange={(date, value) => {}}
            KeyboardButtonProps={{
              "aria-label": "change time",
            }}
            showTodayButton={true}
            readOnly={true}
          />
          <KeyboardTimePicker
            autoOk={true}
            margin="normal"
            id="out-time-picker"
            label="Out Time"
            value={outTime}
            onChange={(date, value) => handleOutTimeChange(date, value)}
            KeyboardButtonProps={{
              "aria-label": "change time",
            }}
            showTodayButton={true}
          />
        </Grid>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            marginTop: "20px",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleSave()}
            disabled={isLoading}
            style={{ marginRight: "10px" }}
          >
            Save
          </Button>
          {isLoading ? <CircularProgress size="small" /> : null}
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleUpdate()}
            disabled={isLoading}
            style={{ marginRight: "10px" }}
          >
            Update
          </Button>
        </div>
      </MuiPickersUtilsProvider>
      <React.Fragment>
        {_.isEmpty(employeeEntries) ? (
          <div>Loading..</div>
        ) : (
          <TableContainer
            component={Paper}
            style={{ marginTop: "16px", marginBottom: "16px" }}
          >
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  <StyledTableCell component="th" scope="row" />
                  <StyledTableCell component="th" scope="row">
                    Date
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    InTime
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    OutTime
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row" align="center">
                    Break
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {_.orderBy(
                  employeeEntries,
                  [
                    function (entry) {
                      return new Date(entry.date);
                    },
                  ],
                  ["desc"]
                )?.map((entry) => (
                  <EmployeeRow
                    key={entry.id}
                    entry={entry}
                    onBreak={(checked) => handleBreak(checked, entry)}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </React.Fragment>
    </div>
  );

  async function handleOutTimeChange(date: Date, value: string) {
    setOutTime(date);
  }

  async function handleSave() {
    setIsLoading(true);
    await AddNewEntry().then((newEntry) => {
      var checkEntry = employeeEntries.find((x) => x.id === newEntry.id);
      if (checkEntry == null) {
        setEmployeeEntries((prevEntries) =>
          prevEntries ? [...prevEntries, newEntry] : [newEntry]
        );
        setIsLoading(false);
      }
      setIsLoading(false);
    });
  }

  async function handleUpdate() {
    var newEntries = [...employeeEntries];
    setIsLoading(true);
    await AddOutTime().then((u) => {
      var updatedEntry = newEntries.find((entry) => entry.id == u.id);
      updatedEntry.outTime = u.outTime;
    });

    setEmployeeEntries(newEntries);
    setIsLoading(false);
  }

  async function handleBreak(checked: boolean, entry: IEmployeeEntryDetails) {
    if (checked) {
      var newEntries = [...employeeEntries];
      setIsLoading(true);
      await AddBreak().then((entry) => {
        var updatedEntry = newEntries.find((x) => x.id === entry.id);
        updatedEntry.breaks.push(...entry.breaks);
      });

      setEmployeeEntries(newEntries);
      setIsLoading(false);
    } else {
      var newEntries = [...employeeEntries];
      setIsLoading(true);
      await UpdateBreak().then((br) => {
        var breaks = newEntries.find((x) => x.id === entry.id).breaks;
        var b = breaks.find((x) => x.id === br.id);
        b.breakFinished = br.breakFinished;
      });

      setEmployeeEntries(newEntries);
      setIsLoading(false);
    }
  }
}

export default EmploeeEntry;
