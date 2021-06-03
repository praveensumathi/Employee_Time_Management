import React, { useEffect, useState } from "react";
import {
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  makeStyles,
  Box,
  FormControlLabel,
  Switch,
} from "@material-ui/core";
import { KeyboardArrowDown, KeyboardArrowUp } from "@material-ui/icons";
import { IEmployeeEntryDetails } from "../../APIs/EmployeeEntry.API";

interface IProps {
  entry: IEmployeeEntryDetails;
}

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
});

function EmployeeRow(props: IProps) {
  const { entry } = props;
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const [isCurrentDate, setIsCurrentDate] = useState(false);

  const classes = useRowStyles();

  useEffect(() => {
    if (entry) {
      new Date(entry.date).getDate() === new Date().getDate()
        ? setIsCurrentDate(true)
        : setIsCurrentDate(false);
    }
  }, [entry]);

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>{new Date(entry.date).toDateString()}</TableCell>
        <TableCell>{new Date(entry.inTime).toLocaleTimeString()}</TableCell>
        <TableCell>
          {entry.outTime ? new Date(entry.outTime).toLocaleDateString() : "-"}
        </TableCell>
        <TableCell align="center">
          {isCurrentDate ? (
            <FormControlLabel
              label={checked ? "In Break" : null}
              labelPlacement="top"
              control={
                <Switch
                  checked={checked}
                  onChange={handleChange}
                  name="Break"
                  color="primary"
                />
              }
            />
          ) : null}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Breaks
              </Typography>
              <Table aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Start</TableCell>
                    <TableCell>End</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {entry.breaks.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell
                        style={{ borderBottom: "none" }}
                        component="th"
                        scope="row"
                      >
                        {new Date(b.breakStart).toLocaleTimeString()}
                      </TableCell>
                      <TableCell style={{ borderBottom: "none" }}>
                        {new Date(b.breakFinished).toLocaleTimeString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );

  function handleChange() {
    setChecked(!checked);
  }
}

export default EmployeeRow;
