import React, { useState } from "react";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
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

  const classes = useRowStyles();

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{new Date(entry.date).toDateString()}</TableCell>
        <TableCell>{new Date(entry.inTime).toLocaleTimeString()}</TableCell>
        <TableCell>
          {entry.outTime ? new Date(entry.outTime).toLocaleDateString() : "-"}
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
}

export default EmployeeRow;
