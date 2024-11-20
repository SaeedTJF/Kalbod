
import React, { useEffect, useState } from 'react';
import api from '@/utils/api'
import DataTable from 'react-data-table-component';
import style from './Manage.module.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CsvDownloadButton from 'react-json-to-csv'

const CRUDChatComponent = () => {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [userData, setUserData] = useState(null);
    const [modal, setmodal] = useState(false)
    const [next, setnext] = useState(null)
    const [prev, setprev] = useState(null)
    const [modaldelete, setmodaldelete] = useState(false)
    const [countpage, setcountpage] = useState(false)
    const [fields, setfields] = useState(null)
    const [selectrow, setselectrow] = useState(null)
    const [clearselect, setclearselect] = useState(false)
    const [valuesearch,setvaluesearch] = useState(null)
    const [formData, setFormData] = useState({
        session: '',
        textbox: '',
        side: 'SEARCH',
        rating: 1,
    });

    useEffect(() => {
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
            const parsedUserData = JSON.parse(storedUserData);
            setUserData(parsedUserData);
            // console.log("Loaded User Data from localStorage:", parsedUserData);
        }
    }, []);
    // Fetch all chats (Read - List)
    const fetchChats = async () => {
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
            const parsedUserData = JSON.parse(storedUserData);
            // console.log("Loaded User Data from localStorage:", parsedUserData);
            const response = await api.get(`chats/`);
            setChats(response.data.results);
            setnext(response.data.next)
            setprev(response.data.previous)
        }
    };
    const fetchfields = async () => {
        try {
            const storedUserData = localStorage.getItem('userData');
            if (storedUserData) {
                const parsedUserData = JSON.parse(storedUserData);
                // console.log("Loaded User Data from localStorage:", parsedUserData);
                const response = await api.get(`get-fields-chat/`);
                setfields(response.data)
            }
        } catch (error) {
            toast.error('عملیات با شکست مواجه شد');
            console.error('There was an error!', error);
        }
    };

    useEffect(() => {
        fetchfields()
        fetchChats();
    }, []);

    // Create or Update chat
    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            if (selectedChat) {
                // Update chat (Update)
                await api.put(`chats/${selectedChat.id}/`, formData, {
                    headers: {
                        Authorization: userData.token,
                        'Content-Type': 'application/json',
                    }
                });
                toast.success(' با موفقیت بروزرسانی شد ')
            } else {
                // Create new chat (Create)
                await api.post(`chats/`, formData, {
                    headers: {
                        Authorization: userData.token,
                        'Content-Type': 'application/json',
                    }
                });
                toast.success('با موفقیت ساخته شد')
            }
            fetchChats();
            setSelectedChat(null);
            setFormData({
                session: '',
                textbox: '',
                side: 'SEARCH',
                rating: 1,
            });
            setmodal(false)
        } catch (error) {
            toast.error('عملیات با شکست مواجه شد');
            console.error('There was an error!', error);
        }
    };

    // Delete chat
    const handleDelete = async (id) => {
        try {
            await api.delete(`chats/${id}/`, {
                headers: {
                    Authorization: userData.token,
                    'Content-Type': 'application/json',
                }
            });
            toast.error('با موفقیت حذف شد')
            setmodaldelete(false)
            fetchChats();
        } catch (error) {
            toast.error('عملیات با شکست مواجه شد');
            console.error('There was an error!', error);
        }
    };

    // Edit chat (Load chat data into form for editing)
    const handleEdit = (chat) => {
        setSelectedChat(chat);
        setmodal(true)
        setFormData({
            session: chat.session, // Assuming you have the session object with an ID
            textbox: chat.textbox,
            side: chat.side,
            rating: chat.rating,
        });
    };

    const columns = [
        { name: <h3>شناسه</h3>, selector: row => row.id, sortable: true, width: "5%"},
        { name: <h3>سشن</h3>, selector: row => row.session, sortable: true, width: "15%" },
        // { name: 'Textbox', selector: row => row.textbox, sortable: true },
        { name: <h3>ساید</h3>, selector: row => row.side, sortable: true, width: "10%" },
        { name: <h3>امتیاز</h3>, selector: row => <>{row.rating == null ? <>0</> : <>{row.rating}</>}</>, sortable: true, width: "10%" },
        { name: <h3>تاریخ</h3>, selector: row => new Date(row.date).toLocaleString(), sortable: true, width: "20%" },
        // { name: <h3>تاریخ</h3>, selector: row => row.date, sortable: true },
        {
            name: <h3>عملیات</h3>, cell: row => (
                <>
                    {/* <button className={`${style.btn} ${style.lightBlueBtn}`} onClick={() => handleEdit(row)}>ویرایش</button> */}
                    <button className={`${style.btn} ${style.lightRedBtn}`} onClick={() => setmodaldelete(row.id)}>حذف</button>
                </>
            ),
            width: "35%"
        }
    ];

    const closemodal = () => {
        setSelectedChat(null);
        setFormData({
            session: '',
            textbox: '',
            side: 'SEARCH',
            rating: 1,
        });
        setmodal(false)
    }
    const searchchat = async (e) => {
        setvaluesearch(e.target.value)
        // try {
        //     let q = e.target.value

        //     const storedUserData = localStorage.getItem('userData');
        //     if (storedUserData) {
        //         const parsedUserData = JSON.parse(storedUserData);
        //         // console.log("Loaded User Data from localStorage:", parsedUserData);

        //         const response = await api.get(`search-chats/?q=${q}`);
        //         setChats(response.data.results);
        //         setnext(response.data.next)
        //         setprev(response.data.previous)
        //     }
        // } catch (error) {
        //     toast.error('عملیات با شکست مواجه شد');
        //     console.error('There was an error!', error);
        // }
    }
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
                setChats(response.data.results);
                setnext(response.data.next)
                setprev(response.data.previous)
            }
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
            let q = `chats/?`
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
                    const response = await api.get(x,{
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
                setChats(response.data.results);
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
    const deleteselect = () => {
        let josndata = {}
        let listid = []
        for (let i in selectrow) {
            listid.push(selectrow[i].id)
        }
        josndata['data'] = listid
        const storedUserData = localStorage.getItem('userData');
        const parsedUserData = JSON.parse(storedUserData);
        api.post(`delete-chat/`, josndata).then(resp => {
            setselectrow(null)
            fetchChats()
            toast.success('عملیات مورد نظر با موفقیت انجام شد')
        }).catch(err => {
            console.log(err)
            toast.error('عملیات با شکست مواجه شد');
        })
    }

    const handlecleartable = () => {

        setselectrow(null)
        setclearselect(!clearselect)

    }
    const downloadcsv = () => {

    }
    return (
        <div>
            <ToastContainer />
            {modaldelete && <div id="myModal" className={style.modal}>

                <div className={style.modalcontent}>
                    <span className={style.close} onClick={() => setmodaldelete(false)}>&times;</span>
                    <br />
                    <center>
                        برای ادامه عملیات گزینه مورد نظر رو انتخاب کنید
                        <br />
                        <br />
                        <button onClick={() => handleDelete(modaldelete)}
                            className={`${style.btn} ${style.lightRedBtn}`}>
                            حذف
                        </button>
                        <button onClick={() => setmodaldelete(false)} className={`${style.btn} ${style.lightBlueBtn}`}>
                            لغو
                        </button>
                    </center>
                </div>
            </div>}
            <div className={style.rowField}>
                <button className={style.createBtn} onClick={() => setmodal(true)}>افزودن چت جدید</button>

                {selectrow && <>
                    <button className={`${style.btn} ${style.lightRedBtn}`} onClick={() => deleteselect()}> حذف موارد انتخاب شده </button>
                    <button className={`${style.btn} ${style.lightBlueBtn}`} onClick={() => handlecleartable()}> لغو   </button>

                </>}
            </div>
            {modal && <div id="myModal" className={style.modal}>

                <div className={style.modalcontent}>
                    <span className={style.close} onClick={() => closemodal()}>&times;</span>
                    <br />
                    <form onSubmit={handleSubmit}>
                        <div className={style.rowField}>
                            <label htmlFor="session">شناسه سشن</label>
                            <input
                                type="text"
                                name="session"
                                value={formData.session}
                                onChange={e => setFormData({ ...formData, session: e.target.value })}
                                placeholder="شناسه سشن"

                            />
                        </div>

                        <div className={style.rowField}>
                            <textarea
                                type="text"
                                name="textbox"
                                value={formData.textbox}
                                onChange={e => setFormData({ ...formData, textbox: e.target.value })}
                                placeholder="محتوا"
                                className={style.textBox}
                            />
                        </div>

                        <div className={style.rowField}>
                            <label htmlFor="side">ساید</label>
                            <select
                                name="side"
                                value={formData.side}
                                onChange={e => setFormData({ ...formData, side: e.target.value })}

                            >
                                <option value="SEARCH">Search</option>
                                <option value="ANSWER">Answer</option>
                                <option value="CHAT">Chat</option>
                                <option value="AI">AI</option>
                            </select>
                        </div>

                        <div className={style.rowField}>
                            <label htmlFor="rating">امتیاز</label>
                            <input
                                type="number"
                                name="rating"
                                value={formData.rating}
                                onChange={e => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                                placeholder="امتیاز اولیه"
                                min="0"
                                max="4"

                            />
                        </div>

                        <div className={style.rowField}>
                            <button type="submit">{selectedChat ? 'بروزرسانی چت' : 'ایجاد چت'}</button>
                        </div>

                    </form>
                </div>
            </div>}
            <div className={style.chatContentContainer}>
                <div className={style.chatFilter}>
                    <div className={style.filterBox}>
                        <h5> دانلود فایل چت ها  </h5>
                        <button className={`${style.btn} ${style.lightBlueBtn}`} onClick={() => filtersession('csv')}>دانلود خروجی</button>
                    </div>
                    <div className={style.rowFilter}>
                        <input type='text' placeholder='مدل . امتیاز . متن چت' id='qchat'
                            onChange={(e) => searchchat(e)} />
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
                        fetchChats()
                    }}>
                        بازنشانی فیلتر
                    </button>

                </div>
                <div className={style.chatTable}>
                    <div className={style.dataTableContainer}>
                        <DataTable
                            className={style.khatamDataTable}
                            title={<h4>لیست چت ها</h4>}
                            columns={columns}
                            data={chats}
                            responsive={true}
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
                        <div className={style.pagination}>
                            <div>
                                {prev && <b>
                                    <>
                                        <button onClick={() => fetchpage(prev)}
                                            className={`${style.btn} ${style.lightRedBtn}`}>صفحه قبلی
                                        </button>
                                    </>
                                </b>}
                                {countpage && <button
                                    className={`${style.btn} ${style.lightBlueBtn}`}>
                                    صفحه {countpage}
                                </button>
                                }


                                {next && <b>
                                    <>
                                        <button onClick={() => fetchpage(next)}
                                            className={`${style.btn} ${style.greenBtn}`}>صفحه بعدی
                                        </button>
                                    </>
                                </b>}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CRUDChatComponent;
