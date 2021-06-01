import React, { useEffect, useState } from "react";
import DateFnsUtils from "@date-io/date-fns";
import Grid from "@material-ui/core/Grid";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import "date-fns";
import { Button } from "@material-ui/core";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { KeyboardArrowDown } from "@material-ui/icons";
import { KeyboardArrowUp } from "@material-ui/icons";
import authService from "../api-authorization/AuthorizeService";

function EmploeeEntry() {
  const [todayDate, setTodayDate] = useState<Date>(new Date());
  const [inTime, setInTime] = useState<Date>(new Date());
  const [outTime, setOutTime] = useState<Date | null>(null);

  useEffect(() => {
    getUser();
    getToken();
  }, []);

  async function getUser() {
    var user = await authService.getUser();
    console.log(user);
  }

  async function getToken() {
    var token = await authService.getAccessToken();
    console.log(token);
  }

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
            value={todayDate}
            onChange={(date, value) => handleDateChange(date, value)}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
            showTodayButton={true}
          />
          <KeyboardTimePicker
            margin="normal"
            id="in-time-picker"
            label="In Time"
            value={inTime}
            onChange={(date, value) => handleInTimeChange(date, value)}
            KeyboardButtonProps={{
              "aria-label": "change time",
            }}
            showTodayButton={true}
          />
          <KeyboardTimePicker
            margin="normal"
            id="out-time-picker"
            label="Out Time"
            value={outTime}
            onChange={(date, value) => handleOutTimeChange}
            KeyboardButtonProps={{
              "aria-label": "change time",
            }}
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
          <Button variant="contained" color="primary">
            Save
          </Button>
        </div>
      </MuiPickersUtilsProvider>
    </div>
  );

  function handleDateChange(date: MaterialUiPickersDate, value: any) {}
  function handleInTimeChange(date: MaterialUiPickersDate, value: any) {
    console.log(date);
    console.log(value);
  }
  function handleOutTimeChange() {}
}

export default EmploeeEntry;
