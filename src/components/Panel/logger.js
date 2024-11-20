import React, { useEffect, useState } from 'react';
import api from '@/utils/api'
import DataTable from 'react-data-table-component';
import style from './Manage.module.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/monikai.css';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const LlmRequestTable = () => {
    const [llmRequests, setLlmRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [next, setnext] = useState(null)
    const [prev, setprev] = useState(null)
    const [countpage, setcountpage] = useState(false)
    const [selectrow, setselectrow] = useState(null)
    const [clearselect, setclearselect] = useState(false)
    const [fields, setfields] = useState(null)
    const [modaldetail, setmodaldetail] = useState(false)
    const [valuesearch,setvaluesearch]= useState(null)
    const [filterParams, setFilterParams] = useState({
        status: '',
        start_date: '',
        end_date: '',
    });

    useEffect(() => {
        fetchLlmRequests();
    }, [filterParams]);

    const fetchLlmRequests = async () => {
        setLoading(true);
        try {
            const response = await api.get('llm_request/');
            setLlmRequests(response.data.results);
            setnext(response.data.next)
            setprev(response.data.previous)

            const responsefields = await api.get('get-fields-llm-request/');

            setfields(responsefields.data)
        } catch (err) {
            setError('Failed to fetch requests.');
        }
        setLoading(false);
    };

    const columns = [
        {
            name: 'شتاسه',
            selector: row => row.id,
            sortable: true,
        },
        {
            name: 'وضعیت',
            selector: row => row.status,
            sortable: true,
        },
        {
            name: 'تاریخ ساخت',
            selector: row => new Date(row.created_at).toLocaleString(),
            sortable: true,
        },
        {
            name: 'تاریخ اتمام عملیات',
            selector: row => new Date(row.done_at).toLocaleString() || 'N/A',
            sortable: true,
        },

        {
            name: <h3>عملیات</h3>, cell: row => (
                <>
                    {/* <button className={`${style.btn} ${style.lightBlueBtn}`} onClick={() => handleEdit(row)}>ویرایش
                    </button> */}
                    <button className={`${style.btn} ${style.lightBlueBtn}`} onClick={() => setmodaldetail(row)}> نمایش اطلاعات
                    </button>

                </>
            )
        }
        // {
        //   name: 'Headers',
        //   selector: row => JSON.stringify(row.headers),
        //   sortable: false,
        // },
        // {
        //   name: 'Payload',
        //   selector: row => JSON.stringify(row.payload),
        //   sortable: false,
        // },
        // {
        //   name: 'URL',
        //   selector: row => row.url,
        //   sortable: true,
        // },
    ];

    const handleFilterChange = (e) => {
        setFilterParams({
            ...filterParams,
            [e.target.name]: e.target.value,
        });
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;


    const fetchpage = async (url) => {
        try {
            const storedUserData = localStorage.getItem('userData');
            if (storedUserData) {
                let xurl = url.split('?')

                let urlparams = new URLSearchParams(xurl[1])
                setcountpage(urlparams.get('page'))
                const parsedUserData = JSON.parse(storedUserData);
                // console.log("Loaded User Data from localStorage:", parsedUserData);
                const response = await api.get(`${url}`);
                setLlmRequests(response.data.results);
                setnext(response.data.next)
                setprev(response.data.previous)
            }
        } catch (error) {
            toast.error('عملیات با شکست مواجه شد');
            console.error('There was an error!', error);
        }
    }
    const handle_select = (val) => {
        setselectrow(val.selectedRows)
        if (val.selectedCount == 0) {
            setselectrow(null)
        }
    }
    const handlecleartable = () => {
        setselectrow(null)

        setclearselect(!clearselect)

    }
    const deleteselect = () => {
        let josndata = {}
        let listid = []
        for (let i in selectrow) {
            listid.push(selectrow[i].id)
        }
        josndata['data'] = listid
        const storedUserData = localStorage.getItem('userData');
        const parsedUserData = JSON.parse(storedUserData);
        api.post(`delete-llm-request/`, josndata).then(resp => {
            // console.log(resp.data)
            setselectrow(null)
            fetchSessions()
            toast.success('عملیات مورد نظر با موفقیت انجام شد')
        }).catch(err => {
            console.log(err)
            toast.error('عملیات با شکست مواجه شد');
        })
    }
    const searchinput = async (e) => {
        try {
            let q = e.target.value
            setvaluesearch(q)
            // const response = await api.get(`search-llm-request/?q=${q}`);
            // setLlmRequests(response.data.results);
            // setnext(response.data.next)
            // setprev(response.data.previous)
        } catch (error) {
            toast.error('عملیات با شکست مواجه شد');
            console.error('There was an error!', error);
        }
    }
    const filtersession = async (event) => {
        try {
            let start = document.getElementById('start_date').value
            let end = document.getElementById('end_date').value
            // let chat_count = document.getElementById('chat_count').value
            let sortselect = document.getElementById('sortselect').value
            const storedUserData = localStorage.getItem('userData');
            let q = `llm_request/?`
            if (storedUserData) {
                if (valuesearch){
                    q = `${q}q=${valuesearch}&`
                }
                if (start && end) {
                    q = `${q}start_date=${start}&end_date=${end}&`
                }

                if (sortselect) {
                    q = `${q}sort=${sortselect}&`
                }
                if (event == "csv") {
                    let x = `${q}export=excel`
                    const response = await api.get(x, {
                        responseType: 'blob'
                    }
                    );
                    console.log(" res ", response)

                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', 'export.xlsx');
                    link.click();
                }
                const parsedUserData = JSON.parse(storedUserData);
                const response = await api.get(q);
                toast.success("عملیات مورد نطر با موفقیت انجام شد")
                setLlmRequests(response.data.results);
                setnext(response.data.next)
                setprev(response.data.previous)


            }
        } catch (error) {
            toast.error('عملیات با شکست مواجه شد');
            console.error('There was an error!', error);
        }
    }
    const jsondownload = (data) => {
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "log" + ".json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        toast.success("عملیات با موفقیت انجام شد")
    }
    return (
        <div>
            <ToastContainer />
            {modaldetail && <div id="myModal" className={style.modal}>

                <div className={style.modalcontentlog}>
                    <span className={style.close} onClick={() => setmodaldetail(false)}>&times;</span>
                    <br />
                    <h5>نمایش اطلاعات دیتا به صورت خام</h5>
                    <button className={`${style.btn} ${style.lightBlueBtn}`} onClick={() => jsondownload(modaldetail)}>دانلود json</button>
                    <CopyToClipboard text={JSON.stringify(modaldetail)}>
                        <button className={`${style.btn} ${style.lightBlueBtn}`} onClick={()=>toast.info("متن مورد نظر کپی شد !")}>کپی json </button>

                    </CopyToClipboard>
                    <br />
                    <br />

                    <div style={{ direction: "ltr" }}>
                        <JSONPretty id="json-pretty" data={modaldetail}></JSONPretty>

                    </div>
                </div>
            </div>}
            <div style={{ display: "flex" }}>
                <h3> لیست عملیات های صورت گرفته</h3>

                {selectrow && <>
                    <button className={`${style.btn} ${style.lightRedBtn}`} onClick={() => deleteselect()}> حذف موارد انتخاب شده </button>
                    <button className={`${style.btn} ${style.lightBlueBtn}`} onClick={() => handlecleartable()}> لغو   </button>

                </>}
            </div>
            <div className={style.sessionsContentContainer}>
                <div className={style.sessionFilter}>
                <div className={style.filterBox}>
                        <h5>   دانلود فایل گزارش ها  </h5>
                        <div>
                            <button className={`${style.btn} ${style.lightBlueBtn}`} onClick={()=>filtersession('csv')}> دانلود خروجی</button>
                        </div>
                    </div>

                    <div className={style.rowFilter}>
                        <input type='text' placeholder='جستوجو در تمام فیلد ها' id='qchat'
                            onChange={(e) => searchinput(e)} />
                    </div>
                    <div className={style.filterBox}>
                        <h5>فیلتر بر اساس تاریخ</h5>
                        <div>
                            <div className={style.dateField}>
                                <span>از</span><input type='date' id='start_date' placeholder='تاریخ شروع ' />
                            </div>
                            <div className={style.dateField}>
                                <span>تا</span> <input type='date' id='end_date' placeholder='تاریخ پایان ' />
                            </div>
                        </div>
                    </div>

                    <div className={style.filterBox}>
                        <h5>مرتب سازی بر اساس فیلد</h5>
                        <div>
                            {fields && <select id='sortselect'>
                                <option value={""}>فیلد مورد نظر را انتخاب کنید</option>
                                {fields.fields.map((mp, key) => <option key={`${mp}${key}`} value={mp}>
                                    {mp}
                                </option>)}
                                {fields.fields.map((mp, key) => <option key={key} value={`-${mp}`}>
                                    {mp} desc
                                </option>)}
                            </select>}
                        </div>
                    </div>
                    <button className={`${style.btn} ${style.lightBlueBtn}`} onClick={() => filtersession()}>
                        اعمال فیلتر
                    </button>
                    <button className={`${style.btn} ${style.lightBlueBtn}`} onClick={() => {
                        fetchLlmRequests()
                    }}>
                        بازنشانی فیلتر
                    </button>
                </div>
                <div className={style.sessionsTable}>
                    <div className={style.dataTableContainer}>
                        <DataTable
                            className={style.khatamDataTable}
                            columns={columns}
                            data={llmRequests}
                            pagination={false}
                            selectableRows={true}
                            onSelectedRowsChange={(val) => { handle_select(val) }}
                            clearSelectedRows={clearselect}
                            contextMessage={{
                                singular: 'آیتم انتخاب شد',
                                plural: 'آیتم انتخاب شد',
                                message: '',
                            }}
                        />
                    </div>
                </div>
            </div>

            <center>
                <div>
                    {prev && <b>
                        <>
                            <button onClick={() => fetchpage(prev)}
                                className={`${style.btn} ${style.lightRedBtn}`}>صفحه قبلی
                            </button>
                        </>
                    </b>}

                    &nbsp;&nbsp;&nbsp;&nbsp;
                    {countpage && <button
                        className={`${style.btn} ${style.lightBlueBtn}`} >
                        صفحه {countpage}
                    </button>
                    }

                    &nbsp;&nbsp;&nbsp;&nbsp;

                    {next && <b>
                        <>
                            <button onClick={() => fetchpage(next)}
                                className={`${style.btn} ${style.greenBtn}`}>صفحه بعدی
                            </button>
                        </>
                    </b>}

                </div>
            </center>
        </div>
    );
};

export default LlmRequestTable;
