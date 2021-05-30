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
import authService from "../api-authorization/AuthorizeService";

function EmploeeEntry() {
  const [todayDate, setTodayDate] = useState<Date>(new Date());
  const [inTime, setInTime] = useState<Date>(new Date());
  const [outTime, setOutTime] = useState<Date | null>(null);

  useEffect(() => {
    getToken();
  }, []);

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
