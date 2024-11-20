import React, { useState, useEffect, useMemo, memo } from "react";
import style from "./KhatmMonitoring.module.css";
import DataTable from "react-data-table-component";
import { IconLoaderAnimated } from "@/components/icons2/iconLoaderAnimated";
import { IconCross } from "@/components/icons2/iconCross";
import Image from "next/image";
import { BeatLoader } from "react-spinners";
import { IconCheck } from "@/components/icons2/iconCheck";
import { IconClose } from "@/components/icons2/iconClose";
import { IconRefresh } from "@/components/icons2/iconRefresh";
import { IconHappyBot } from "@/components/icons2/iconHappy";
import { IconBot } from "@/components/icons2/iconBot";
import { IconZarbdar } from "@/components/icons2/iconZarbdar";
import { IconWatch } from "@/components/icons2/iconWath";
import { useLayoutEffect } from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import { IconArrowBottom } from "@/components/icons2/iconArrowBottom";
import { IconArrowUp } from "@/components/icons2/IconArrowUp";
import ChartComponent from "@/components/Admin/AdminDashboard/ChartComponent";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}`

export default function Khatm_Monitoring() {
  const [currentUser, setCurrentUser] = useState("0");
  const [reqs, setReqs] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [spinnerStatus, setSpinnerStatus] = useState({});
  const [spinnerInquiryStatus, setSpinnerInquiryStatus] = useState({});
  const [resultStatus, setResultStatus] = useState({});
  const [services, setServices] = useState([]);
  const [statuslist, setStatuslist] = useState([]);
  const [tracker_id, setTrackerId] = useState(null);

  const [flag, setFlag] = useState(null);
  const [currentTime, setcurrentTime] = useState(2000);
  const [prevoiusTime, setprevoiustTime] = useState(3000);
  const [intervalId, setintervalId] = useState(false);

  const [count_c_ai, setCountCAi] = useState(0);
  const [count_e_ai, setCountEAi] = useState(0);

  const [count_c_requ, setCountCReq] = useState(0);
  const [count_e_requ, setCountEReq] = useState(0);
  const [count_p_requ, setCountPReq] = useState(0);

  const [count_c_llm, setCountCLlm] = useState(0);
  const [count_e_llm, setCountELlm] = useState(0);
  const [count_p_llm, setCountPLlm] = useState(0);

  const [count_llm, setCountLlm] = useState(0)

  const [preReq, setPreReq] = useState([]);
  const [llm, setLlm] = useState([]);

  const [spinner, setSpinner] = useState(false);

  const [closeUp1, SetCloseUp1] = useState(true);
  const [closeUp2, SetCloseUp2] = useState(false);

  const [ChartData, setChartData] = useState({});

  const [flagTimer, setFlagTimer] = useState({});
  const [flagTimerTwo, setFlagTimerTwo] = useState({});

  const [disabledFlag, setDisabledFlag] = useState(true)
  const [dataFlag, setDataflag] = useState(1)

  const [seconds, setSeconds] = useState(0);



  const sendAgin = (id) => {
    // console.log("id ==> ", id);
    setFlagTimerTwo((prev) => ({ ...prev, [id]: true }));
    setFlagTimer((prev) => ({ ...prev, [id]: true }));
    // console.log(" befor **  ", ChartData[id])
    setChartData((prevState) => {
      const newState = { ...prevState };
      if (newState[id]) {
        newState[id] = {};
      }
      return newState;
    });
    // console.log(" after --- ", ChartData[id])

  };
  const chart_data = [
    { x: 0, cpu: 130.33 },
    { x: 5, cpu: 131.22 },
    { x: 10, cpu: 129.75 },
    { x: 15, cpu: 127.75 },
    { x: 20, cpu: 129.75 },
    { x: 25, cpu: 128.75 },
    { x: 30, cpu: 134.75 },
    { x: 35, cpu: 132.75 },
    { x: 40, cpu: 131.75 },
    { x: 45, cpu: 129.75 },
    { x: 50, cpu: 126.75 },
    { x: 55, cpu: 124.75 },
    { x: 60, cpu: 135.75 },
  ];
  const services1 = [
    {
      id: "015-525438-3",
      birthDay: "22",
    },
  ];
  const columns1 = [
    {
      name: <h3>Service Name</h3>,
      selector: (row) => <span className={style.serviceName}>{row.name}</span>,
      width: "10%",
    },
    {
      name: <h3>Url Address 1</h3>,
      selector: (row) => (
        <span className={style.serviceName}>{row.url_address}</span>
      ),
      width: "35%",
    },
    {
      name: <h3>Url Address 2</h3>,
      selector: (row) => (
        <span className={style.serviceName}>{row.url_address2}</span>
      ),
      width: "35%",
    },
    {
      name: <h3>Check</h3>,
      selector: (row) => (
        <span className={style.serviceName}>
          <div key={row.id} className={style.dataTableBtns}>
            {spinnerStatus[row.id] == true ? (
              <BeatLoader color="#0f7e4b" />
            ) : spinnerStatus[row.id] == "Done" ? (
              <IconCheck color={"green"} size={"25px"} />
            ) : spinnerStatus[row.id] == "Error" ? (
              <IconClose color={"red"} size={"25px"} />
            ) : (
              <button
                id={`Info${row.id}`}
                className={`${style.buttons}  `}
              // onClick={() => handleInquery(row.id, row.inquery)}
              >
                <IconRefresh size={"30px"} color={"#0b8d7c"} />
              </button>
            )}
          </div>
        </span>
      ),
      width: "7%",
      center: "true",
    },
  ];
  const columns2 = [
    {
      name: <h3>Service Name</h3>,
      selector: (row) => <span className={style.serviceName}>{row.name}</span>,
      width: "70%",
    },
    {
      name: <h3>Check</h3>,
      selector: (row) => (
        <span className={style.serviceName}>
          <div key={row.id} className={style.dataTableBtns}>
            {spinnerStatus[row.id] == true ? (
              <BeatLoader color="#ffc524" />
            ) : spinnerStatus[row.id] == "Done" ? (
              <IconCheck color={"green"} size={"25px"} />
            ) : spinnerStatus[row.id] == "Error" ? (
              <IconClose color={"red"} size={"25px"} />
            ) : (
              <button
                id={`Info${row.id}`}
                className={`${style.buttons}  `}
              // onClick={() => handleInquery(row.id, row.inquery)}
              >
                <IconRefresh size={"30px"} color={"#0b8d7c"} />
              </button>
            )}
          </div>
        </span>
      ),
      width: "30%",
    },
  ];
  const services2 = [
    {
      id: "015-525438-3",
      birthDay: "22333",
    },
  ];

  const addDataPoint = (id, dataType, dataPoint) => {
    setChartData((prevState) => {
      const newState = { ...prevState };
      if (!newState[id]) {
        newState[id] = {};
      }
      if (!newState[id][dataType]) {
        newState[id][dataType] = [];
      }
      newState[id][dataType].push(dataPoint);
      return newState;
    });
  };

  // const addDataPoint = (id, dataType, dataPoint) => {
  //   let temp_chart = ChartData;
  //   console.log(" temp_chart ", temp_chart);
  //   if (!temp_chart[id]) {
  //     temp_chart[id] = {};
  //   }
  //   console.log(" temp_chart id ", temp_chart[id]);

  //   if (!temp_chart[id][dataType]) {
  //     temp_chart[id][dataType] = [];
  //   }
  //   console.log(" temp_chart ", temp_chart[id][dataType]);

  //   temp_chart[id][dataType].push(dataPoint);
  //   setChartData(temp_chart);

  // setChartData(prevState => {
  //   // ایجاد کپی از داده‌های قبلی
  //   const newState = { ...prevState };

  //   // اگر شناسه در داده‌ها موجود نیست، آن را اضافه کن
  //   if (!newState[id]) {
  //     newState[id] = {}; // فقط ایجاد شیء جدید بدون مقداردهی اولیه برای انواع داده
  //   }

  //   // اگر نوع داده مورد نظر در شناسه وجود ندارد، آن را اضافه کن
  //   if (!newState[id][dataType]) {
  //     newState[id][dataType] = [];
  //   }

  //   // اضافه کردن داده جدید
  //   newState[id][dataType].push(dataPoint);

  //   // برگرداندن شیء جدید برای به‌روزرسانی وضعیت
  //   return newState;
  // });
  // };

  const handleChartData = async (source, id, url, elapsedTime) => {
    let newChartData;
    // console.log(" in handleChartData id ", id);

    let newUrl = url.split("/");
    newUrl[newUrl.length - 1] = "healthcheck";
    newUrl = newUrl.join("/");

    try {
      const response = await axios.post(newUrl, {}, { timeout: 5000 });
      if (response.status === 200) {
        const result = response.data;
        // Removing items where the name is "N/A"
        Object.keys(result).forEach((key) => {
          if (result[key].name === "N/A") {
            delete result[key];
          }
        });
        newChartData = {};
        for (const [key, value] of Object.entries(result)) {


          //   Create or update the chart data for each type
          addDataPoint(id, key, {
            x: elapsedTime,
            [key]: value.usage_percent,
          });
        }

      }
    } catch (e) {
      console.error("Error:", e.message);
    }
  };

  let currentSecond = 0;

  const startInterval = (source, id, url) => {
    let currentSecond = 0;

    const intervalId1 = setInterval(() => {
      if (currentSecond <= 10) {
        handleChartData(source, id, url);
        currentSecond += 5;
      } else {

        for (const [key, value] of Object.entries(ChartData)) {

        }

        clearInterval(intervalId1); // توقف اجرای متناوب پس از 60 ثانیه
      }
    }, 5000);
  };

  const setstatus = async () => {
    setDisabledFlag(true)
    setTrackerId(null);
    setFlag(null);
    setcurrentTime(2000);
    setprevoiustTime(2000);
    setintervalId(false);

    setSpinnerStatus((prevStatus) => {
      const newStatus = { ...prevStatus };
      for (let key in newStatus) {
        newStatus[key] = true;
      }
      return newStatus;
    });

    try {
      const listpending = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/llmserversmonitoring/`, {
        headers: {
          'Authorization': "Amin_4545",
          'Content-Type': 'application/json',
        }
      });
      setSpinnerStatus((prevStatus) => {
        const newStatus = { ...prevStatus };
        for (let key in newStatus) {
          newStatus[key] = listpending.data[key];
        }
        return newStatus;
      });

      let c = 0;
      let e = 0;

      let c_requ = 0;
      let e_requ = 0;

      let index = 0;

      let size = Object.keys(listpending.data).length;

      for (let key in listpending.data) {

        if (index >= size - 2) {
          if (listpending.data[key] == "Done") {
            c_requ++;
          } else {
            e_requ++;
          }
        } else {
          if (listpending.data[key] == "Done") {
            c++;
          } else {
            e++;
          }
        }
        index++;
      }
      setCountCLlm(c);
      setCountELlm(e);
      setCountPLlm(0);

      setCountCReq(c_requ);
      setCountEReq(e_requ);
      setCountPReq(0);
      setDisabledFlag(false)
    } catch (error) {
      console.error("Error fetching listpending:", error);
    }
  };

  const FilterComponent = ({ filterText, onFilter, onClear }) => (
    <div className={style.filterBox}>
      <input
        id="search"
        type="text"
        placeholder="Filter By Name"
        aria-label="Search Input"
        value={filterText}
        onChange={onFilter}
      />
      <button onClick={onClear}>
        <IconCross size={"14px"} />
      </button>
    </div>
  );

  const TableLoader = () => (
    <div className={style.tableLoader}>
      <IconLoaderAnimated size={"80px"} />
    </div>
  );

  useEffect(() => {


    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}/llmserversmonitoring/`, {
        headers: {
          'Authorization': "Amin_4545",
          'Content-Type': 'application/json',
        }
      })
      .then((resp) => {
        setServices(resp.data);
        setPreReq(resp.data.pre_requirement);
        setLlm(resp.data.llm);
        if (resp.data.result.length > 0) {
          setDisabledFlag(false)
          // setDataflag(1)
          setDataflag(2)
        }
        else {
          // setDataflag(1)

          //
          // 0f7e4b
          // white

          setDataflag(3)
        }
        setCountPReq(resp.data.pre_requirement.length)
        setCountPLlm(resp.data.result.length - resp.data.pre_requirement.length)
        setCountLlm(resp.data.result.length - resp.data.pre_requirement.length)

        resp.data.llm.forEach((item) => {
          item.llmserver_set.forEach((inner_item) => {
            ChartData[inner_item.id] = {};
            flagTimer[inner_item.id] = true;
            flagTimerTwo[inner_item.id] = true;
            if (inner_item.name !== "N/A") {
              Object.keys(inner_item.source).forEach((key) => {

                ChartData[inner_item.id][key] = [];
              });
            }
          });
        });
        setSpinner(true);
        const initialSpinnerStatus = resp.data.result.reduce((acc, item) => {
          acc[item.id] = null;
          return acc;
        }, {});

        setSpinnerStatus(initialSpinnerStatus);
      })
      .catch((err) => {
        setDataflag(3)
        console.log(err);
      });
  }, []);

  // const filteredItems = services.filter((item) =>
  //   item.data.toLowerCase().includes(filterText.toLowerCase())
  // );

  const subHeaderComponentMemo = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText("");
      }
    };

    return (
      <FilterComponent
        onFilter={(e) => setFilterText(e.target.value)}
        onClear={handleClear}
        filterText={filterText}
      />
    );
  }, [filterText, resetPaginationToggle]);

  const columns = [
    {
      name: <h3>Service Name</h3>,
      selector: (row) => (
        <span className={style.serviceName}>{row.llm_name}</span>
      ),
      width: "30%",
    },
    {
      name: <h3>Service version</h3>,
      selector: (row) => (
        <span className={style.serviceName}>{row.llm_version}</span>
      ),
      width: "15%",
    },
    {
      name: <h3>Server name</h3>,
      selector: (row) => <span className={style.serviceName}>{row.name}</span>,
      width: "25%",
    },
    {
      name: <h3>Check</h3>,
      selector: (row) => (
        <div key={row.id} className={style.dataTableBtns}>
          {spinnerStatus[row.id] == true ? (
            <BeatLoader color="#ffc524" />
          ) : spinnerStatus[row.id] == "Done" ? (
            <IconCheck color={"green"} size={"25px"} />
          ) : spinnerStatus[row.id] == "Error" ? (
            <IconClose color={"red"} size={"25px"} />
          ) : (
            <button
              id={`Info${row.id}`}
              className={`${style.buttons}  `}
            // onClick={() => handleInquery(row.id, row.inquery)}
            >
              <IconRefresh size={"30px"} color={"#0b8d7c"} />
            </button>
          )}
        </div>
      ),
      width: "30%",
    },
  ];

  const conditionalRowStyles = [
    {
      when: (row) => true,
      style: {
        padding: "20px 0px",
      },
    },
  ];

  const [pending, setPending] = useState(true);
  const [rows, setRows] = useState([]);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setRows(reqs);
      setPending(false);
    }, 800);
    return () => clearTimeout(timeout);
  }, [reqs]);

  function handleCloseModal1() {
    SetCloseUp1((pre) => !pre);
  }

  function handleCloseModal2() {
    SetCloseUp2((pre) => !pre);
  }

  const ExpandableRow = ({ data, type }) => {

    const sendRequest = (source, id, url, elapsedTime) => {
      // console.log(
      //   `Sending request to ${url} with source: ${source} and id: ${id} and elapsedTime ${elapsedTime}`
      // );

    };


    const getValidUrl = async (url1, url2) => {
      try {
        // Send requests to both URLs

        let newUrl1 = url1.split("/");
        newUrl1[newUrl1.length - 1] = "healthcheck";
        newUrl1 = newUrl1.join("/");

        let newUrl2 = url2.split("/");
        newUrl2[newUrl2.length - 1] = "healthcheck";
        newUrl2 = newUrl2.join("/");

        // console.log(" n u 1 ", newUrl1)
        // console.log(" n u 2 ", newUrl2)

        const [res1, res2] = await Promise.allSettled([
          axios.post(newUrl1, {}, { timeout: 5000 }),
          axios.post(newUrl2, {}, { timeout: 5000 })
        ]);

        // console.log("Response 1:", res1);
        // console.log("Response 2:", res2);
        if (res1.status === 'fulfilled' && res1.value.statusText == "OK") {
          return url1;
        } else if (res2.status === 'fulfilled' && res2.value.statusText == "OK") {
          return url2;
        } else {
          throw new Error('Both URLs failed to respond.');
        }
      } catch (error) {
        console.error(error);
        return null;
      }
    };


    const startInterval = async (source, id, url1, url2) => {
      const url = await getValidUrl(url1, url2);
      // console.log(" finally url ", url)
      if (!url) {
        // console.error('No valid URL found, stopping execution.');
        return;
      }

      let elapsedTime = 0;
      const intervalId = setInterval(() => {
        handleChartData(source, id, url, elapsedTime);
        elapsedTime += 5;
      }, 5000);

      // const secondsInterval = setInterval(() => {
      //   setSeconds((prevSeconds) => {
      //     if (prevSeconds < 60) {
      //       return prevSeconds + 1;
      //     } else {
      //       clearInterval(secondsInterval);
      //       return prevSeconds;
      //     }
      //   });
      // }, 1000);

      setTimeout(() => {
        clearInterval(intervalId);
        // clearInterval(secondsInterval);
        setFlagTimerTwo((prev) => ({ ...prev, [data.id]: false }));
        // console.log("Stopped sending requests");
      }, 60000);
    };

    useEffect(() => {
      // console.log(data)
      // console.log(" flagTimer ", flagTimer);
      if (flagTimer[data.id]) {
        startInterval(data.source, data.id, data.url_address, data.url_address2);
        setFlagTimer((prev) => ({ ...prev, [data.id]: false }));
      }
    }, [data]);

    const { source } = data;

    return (
      <>
        {type && type == "show" ?
          <div className={style.expandableRow}>
            {source ? (
              <>
                <div className={style.details}>
                  <div className={style.detail}>
                    <div className={style.percentContainer}>
                      <CircularProgressbar
                        value={source.cpu.usage_percent}
                        text={`${source.cpu.usage_percent}%`}
                        circleRatio={0.75}
                        styles={buildStyles({
                          rotation: 1 / 2 + 1 / 8,
                          strokeLinecap: "butt",
                          textSize: "20px",
                          pathTransitionDuration: 2,
                          pathColor: `#026dbf`,
                          textColor: "#026dbf",
                          trailColor: "#d6d6d6",
                          backgroundColor: "#3e98c7",
                        })}
                      />
                    </div>
                    <div className={style.detailContent}>
                      <p>CPU Stats</p>
                      <p>
                        <span>Cores:</span>
                        <span>{source.cpu.cores}</span>
                      </p>
                      <p>
                        <span>Capacity :</span>{" "}
                        <span>
                          {source.cpu.used_capacity.toFixed(0)}/
                          {source.cpu.total_capacity.toFixed(0)}
                        </span>
                      </p>
                    </div>
                  </div>

                  {source.gpu && (
                    <div className={style.detail}>
                      <div className={style.percentContainer}>
                        <CircularProgressbar
                          value={source.gpu.usage_percent}
                          text={`${source.gpu.usage_percent.toFixed(1)}%`}
                          circleRatio={0.75}
                          styles={buildStyles({
                            rotation: 1 / 2 + 1 / 8,
                            strokeLinecap: "butt",
                            textSize: "20px",
                            pathTransitionDuration: 2,
                            pathColor: `#76b900`,
                            textColor: "#76b900",
                            trailColor: "#d6d6d6",
                            backgroundColor: "#3e98c7",
                          })}
                        />
                      </div>
                      <div className={style.detailContent}>
                        <p style={{ color: "#76b900" }}>GPU Stats</p>
                        <p>
                          <span>Name:</span> <span>{source.gpu.name}</span>
                        </p>
                        <p>
                          <span>Memory:</span>{" "}
                          <span>
                            {source.gpu.used_memory} / {source.gpu.total_memory}
                          </span>
                        </p>
                      </div>
                    </div>
                  )}

                  <div className={style.detail}>
                    <div className={style.percentContainer}>
                      <CircularProgressbar
                        value={source.memory.usage_percent}
                        text={`${source.memory.usage_percent}%`}
                        circleRatio={0.75}
                        styles={buildStyles({
                          rotation: 1 / 2 + 1 / 8,
                          strokeLinecap: "butt",
                          textSize: "20px",
                          pathTransitionDuration: 2,
                          pathColor: `#ffb42a`,
                          textColor: "#ffb42a",
                          trailColor: "#d6d6d6",
                          backgroundColor: "#3e98c7",
                        })}
                      />
                    </div>
                    <div className={style.detailContent}>
                      <p style={{ color: "#ffb42a" }}>Memory Stats</p>
                      <p>
                        <span>Memory :</span>{" "}
                        <span>
                          {source.memory.used_memory} / {source.memory.total_memory}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className={style.monitoringLiveCharts}>
                  <div className={style.monitoringTitle}>
                    <div className={`${style.monitoringTitleH3} ${style.monitoringTitle}`}>

                      <span style={{ fontSize: "35px" }}>
                        {flagTimerTwo[data.id] === false ? (<>
                          <button className={style.unStyledBtn} onClick={() => sendAgin(data.id)}><IconRefresh
                            size={"18px"} color={"#128193"} /></button>
                        </>) :
                          (<>  <BeatLoader color="#ffc524" /></>)}
                      </span>
                      <h3>نمایش زنده آمار</h3>
                    </div>
                  </div>
                  <div className={style.details}>
                    <div style={{ width: '30%' }}>
                      {/* <h1> H1 </h1> */}
                      {source.cpu && (
                        <ChartComponent
                          labelText={"cpu"}
                          title={"Cpu usage log"}
                          chartData={ChartData[data.id]["cpu"]}
                          x_label={"Time (Seconds)"}
                          y_label={`Percentage of cpu used`}
                          fillColor="#026dbf"
                          lineColor="#239bf7"
                        />
                      )}
                    </div>


                    <div style={{ width: '30%' }}>
                      {/* <h1> H2 </h1> */}
                      {source.gpu && (
                        <ChartComponent
                          labelText={"gpu"}
                          title={"Gpu usage log"}
                          chartData={ChartData[data.id]["gpu"]}
                          x_label={"Time (Seconds)"}
                          y_label={"Percentage of gpu used"}
                          fillColor="#76b900"
                          lineColor="#005b31"
                        />
                      )}
                    </div>


                    <div style={{ width: '30%' }}>
                      {/* <h1> H3 </h1> */}
                      {source.memory && (
                        <ChartComponent
                          labelText={"memory"}
                          title={"Memory usage log"}
                          chartData={ChartData[data.id]["memory"]}
                          x_label={"Time (Seconds)"}
                          y_label={"Percentage of memory used"}
                          fillColor="#ffb42a"
                          lineColor="rgba(255,0,0,0.2)"
                        />
                      )}
                    </div>


                  </div>
                </div>
              </>
            ) : (
              <div className={style.errorHandleBox}>
                <center>
                  <h3>دیتای سرور در دسترس نمی باشد</h3>
                </center>
              </div>
            )}
          </div> : <>
            {source ? <div className={style.serverOn}></div> : <div className={style.serverOff}></div>}
          </>
        }
      </>
    );
  };
  // ExpandableRow.displayName = "ExpandableRow";
 
  
  const showandsetblock = (row) => {
    for (let i in llm) {
      document.getElementById(`block-${llm[i].id}`).style.display = "none"
      document.getElementById(`showblock-${llm[i].id}`).style.backgroundColor = "#f5f5f5"

    }
    document.getElementById(`block-${row.id}`).style.display = "block"
    document.getElementById(`showblock-${row.id}`).style.backgroundColor = "#f5ecdb"


  }

  
  const copybtn = (text) => {
    try {
      navigator.clipboard.writeText(text)
      navigator.clipboard.writeText(text).then(function () {
        toast.success('در کلیدبرد ذخیره شد');
      }, function (err) {
        console.error('Async: Could not copy text: ', err);
      });
    } catch (error) {
      
    }
  }
  return (
    <div className={style.khatamModelsStats}>
      <ToastContainer />

      {dataFlag === 1 ? (
        <div className={style.ItemsHeaderLoader}><BeatLoader color="#ffc524" size={25} /></div>) : dataFlag === 3 ? (
          <div className={style.ItemsHeader}>
            <p>There is no data to display.</p>
            <div className={style.ItemsHeaderOptions}>
            </div>
          </div>
        ) : (
        <div className={style.monitoringContainer}>
          <div className={style.monitoringItemList}>
            {llm && llm.map((row,key) => <div id={`showblock-${row.id}`}  style={key == 2 ? {backgroundColor: "#f5ecdb"} : {backgroundColor: "white"} } key={row.id} className={style.llmMonitorItem}
              onClick={() => showandsetblock(row)}>
              <Image src={`${API_BASE_URL}${row.icon}`} alt={row.name} width={40} height={40} />
              <div className={style.llmMonitorItemdetails}>
                <div className={style.llmMonitorItemName}>{row.name}</div>

                <div id={`checkblock${row.id}`}>
                  {row.llmserver_set.map(item => <>
                    <div className={style.llmServerName}>{item.name}</div>
                    <ExpandableRow data={item} type={"check"}/>
                  </>)}
                </div>
              </div>

            </div>)}
          </div>
          <div className={style.monitoringDetailsContent}>
            {llm.map((items,key) => (
                
                <div key={items.id} style={key == 2 ? {display: "block"} : {display: "none"} } id={`block-${items.id}`}>
                  
                  <div>
                    {items.llmserver_set.map(row => <>
                    <div className={style.llmStatsHeader}>
                      <div className={style.headerRight}>
                        <div className={style.serviceName}>
                          <span>نگارش: {items.version}</span> | <span>{row.name}</span></div>
                        <div className={`${style.tooltipAble} ${style.address}`}>
                          <span onClick={() => copybtn(row.url_address)}>آدرس شماره یک</span>
                          <div className={style.tooltip} >
                            {row.url_address}
                          </div>
                        </div>
                        <div className={`${style.tooltipAble} ${style.address}`}>
                          <span onClick={() => copybtn(row.url_address2)}>آدرس شماره دو</span>
                          <div className={style.tooltip} >
                            {row.url_address2}
                          </div>
                        </div>
                      </div>

                      <div className={style.btnReCheck}>
                        {spinnerStatus[row.id] === true ? (
                          <BeatLoader color="#0f7e4b" />
                        ) : spinnerStatus[row.id] === "Done" ? (
                          <IconCheck color={"green"} size={"18px"} />
                        ) : spinnerStatus[row.id] === "Error" ? (
                          <IconClose color={"red"} size={"18px"} />
                        ) : (
                          <button
                            id={`Info${row.id}`}
                            className={`${style.buttons}  `}
                            onClick={() => sendAgin(row.id)}
                          // onClick={() => handleInquery(row.id, row.inquery)}
                          >
                            <IconRefresh size={"18px"} color={"#0b8d7c"} />
                          </button>
                        )}
                        <span onClick={() => sendAgin(row.id)}>نمایش آمار</span>
                      </div>
                    </div>


                    <ExpandableRow data={row} type={"show"} />
                  </>)}
                </div>


              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
