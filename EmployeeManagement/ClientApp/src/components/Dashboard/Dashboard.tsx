import _ from "lodash";
import React, { useEffect, useState } from "react";
import Chart from "react-google-charts";
import {
  IEmployeeEntryDetails,
  GetAllDetails,
  GetAuthUserEntryDetails,
} from "../../APIs/EmployeeEntry.API";

function Dashboard() {
  const [allDetails, setAllDetails] = useState<IEmployeeEntryDetails[]>([]);

  async function GetDetails() {
    await GetAuthUserEntryDetails().then((entries) => {
      setAllDetails(entries);
      console.log(entries);
    });
  }
  useEffect(() => {
    GetDetails();
  }, []);

  function handelTimeCalculate(e: IEmployeeEntryDetails) {
    var totalBreakM;
    var totalWorkH;
    var st = 0;
    var en = 0;

    const chartData = [["Total Work", "Total Break"]];
    e.breaks.map((b, index) => {
      if (index == 0) {
        st = Number(
          (new Date(b.breakStart).getHours() % 12) * 60 +
            new Date(b.breakStart).getMinutes()
        );
      }
      if (index == e.breaks.length - 1) {
        en = Number(
          (new Date(b.breakFinished).getHours() % 12) * 60 +
            new Date(b.breakFinished).getMinutes()
        );
      }
    });

    var i = Number(
      (new Date(e.inTime).getHours() % 12) * 60 +
        new Date(e.inTime).getMinutes()
    );
    var o = Number(
      (new Date(e.outTime).getHours() % 12) * 60 +
        new Date(e.outTime).getMinutes()
    );

    totalBreakM = en - st;
    totalWorkH = o - i;
    totalWorkH = Number(totalWorkH - totalBreakM);

    chartData.push(["Total Break in Min", totalBreakM]);
    chartData.push(["Total Work in Min", totalWorkH]);

    return chartData;
  }

  return (
    <div>
      <h1 style={{ borderBottom: "2px solid black", marginBottom: "10px" }}>
        Dashboard
      </h1>
      <div style={{ display: "flex", justifyContent: "space-evenly" }}>
        {!_.isEmpty(allDetails)
          ? allDetails.map((x) => {
              return (
                <div>
                  <h1>{new Date(x.date).toDateString()}</h1>
                  <div>
                    <Chart
                      width={"500px"}
                      height={"300px"}
                      chartType="PieChart"
                      loader={<div>Loading Chart</div>}
                      data={handelTimeCalculate(x)}
                      options={{
                        title: "My Daily Activities",
                      }}
                      rootProps={{ "data-testid": "1" }}
                    />
                  </div>
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
}

export default Dashboard;
