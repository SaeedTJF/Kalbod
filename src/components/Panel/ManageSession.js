
import React, { useEffect, useState } from 'react';
import api from '@/utils/api'
import DataTable from 'react-data-table-component';
import style from './Manage.module.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from "next/image";
const API_BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}`
// llm_history

import 'prismjs/themes/prism-okaidia.css'
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';

import { IconStarFill } from "@/components/Icons/iconStarFill";
import { IconArrowBottom } from "@/components/Icons/iconArrowBottom";

const markdownToHtml = (markdown) => {
    if (typeof markdown !== 'string') {
        markdown = String(markdown);
    }

    // const container = document.getElementById('chatWrapRef');
    // container.scrollTop = container.scrollHeight;

    // Regular expression for both Python and Java code blocks
    const codeBlockRegex = /```(python|java)([\s\S]*?)```/g;

    // Replacing code blocks with highlighted HTML
    const htmlContent = markdown.replace(codeBlockRegex, (match, language, code, index) => {
        // container.scrollTop = container.scrollHeight;

        // Determine the language for syntax highlighting
        let highlightedCode;
        if (language === 'python') {
            highlightedCode = Prism.highlight(code, Prism.languages.python, 'python');
        } else {
            highlightedCode = Prism.highlight(code, Prism.languages.java, 'java');
        }

        return `
        <div style="position: relative">
        <button class="copy-button" data-id="code-${index}" style="backgroungcolor:"white;color:black;padding:6px;">Copy</button>
            <pre class="language-${language}" style="display:flex;">
                
                <code id="code-${index}">${highlightedCode}</code>
            </pre>
        </div>`;
    });

    // container.scrollTop = container.scrollHeight;

    setTimeout(() => {
        document.querySelectorAll('.copy-button').forEach(button => {
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);

            newButton.addEventListener('click', () => {
                const codeId = newButton.getAttribute('data-id');
                const codeElement = document.getElementById(codeId);
                const range = document.createRange();
                range.selectNodeContents(codeElement);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);

                try {
                    document.execCommand('copy');
                    toast.success('Code copied to clipboard!');
                } catch (err) {
                    toast.error('Failed to copy code!');
                }

                selection.removeAllRanges();
            });
        });
    }, 0);

    // Replace Markdown bold text (**) with HTML <h1> tags
    const finalHtmlContent = htmlContent.replace(/\*\*(.+?)\*\*/g, (match, p1) => {
        return `<h1>${p1}</h1>`;
    });

    // Additional replacements (for example, handling asterisks)
    const finalHtmlContentav = finalHtmlContent.replace(/\*/g, "<br>*");

    return finalHtmlContentav;
};


const CRUDSessionComponent = () => {
    const [sessions, setSessions] = useState([]);
    const [userData, setUserData] = useState(null);
    const [modal, setmodal] = useState(false)
    const [selectedSession, setSelectedSession] = useState(null);
    const [modalchat, setmodalchat] = useState(false)
    const [sessionchat, setsessionchat] = useState(null)
    const [data, setdata] = useState(null)
    const [users, setUsers] = useState([]);
    const [llms, setLlms] = useState([]);
    const [next, setnext] = useState(null)
    const [prev, setprev] = useState(null)
    const [countpage, setcountpage] = useState(false)
    const [modelllm, setmodelllm] = useState(false)
    const [modaldelete, setmodaldelete] = useState(false)
    let [morellm, setmorellm] = useState(null)
    const [fields, setfields] = useState(null)
    const [selectrow, setselectrow] = useState(null)
    const [clearselect, setclearselect] = useState(false)
    const [valuesearch, setvaluesearch] = useState(null)
    const [llmsearch, setllmsearch] = useState(null)
    const [formData, setFormData] = useState({
        id: "",
        user: '', // ID of the user
        // llm_history: '[]',
        llm: '', // ID of the llm
    });
    useEffect(() => {
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
            const parsedUserData = JSON.parse(storedUserData);
            setUserData(parsedUserData);
            // console.log("Loaded User Data from localStorage:", parsedUserData);
        }
    }, []);
    const fetchUsers = async () => {
        try {
            const storedUserData = localStorage.getItem('userData');
            if (storedUserData) {
                const parsedUserData = JSON.parse(storedUserData);
                // console.log("Loaded User Data from localStorage:", parsedUserData);
                const response = await api.get(`users/`);
                setUsers(response.data.results);
            }
        } catch (error) {
            toast.error('عملیات با شکست مواجه شد');
            console.error('There was an error!', error);
        }

    };
    // Fetch all sessions (Read - List)
    const fetchSessions = async () => {
        try {
            const storedUserData = localStorage.getItem('userData');
            if (storedUserData) {
                const parsedUserData = JSON.parse(storedUserData);
                // console.log("Loaded User Data from localStorage:", parsedUserData);

                const response = await api.get(`sessions/`);
                setnext(response.data.next)
                setprev(response.data.previous)
                setSessions(response.data.results);
                setdata(response.data.results)
            }
        } catch (error) {
            toast.error('عملیات با شکست مواجه شد');
            console.error('There was an error!', error);
        }

    };
    const fetchLlms = async () => {
        try {
            const storedUserData = localStorage.getItem('userData');
            if (storedUserData) {
                const parsedUserData = JSON.parse(storedUserData);
                // console.log("Loaded User Data from localStorage:", parsedUserData);
                const response = await api.get(`llms/`);
                setLlms(response.data.results);
                setmorellm(response.data.next)
            }
        } catch (error) {
            toast.error('عملیات با شکست مواجه شد');
            console.error('There was an error!', error);
        }
    };

    const fetchfields = async () => {
        try {
            const storedUserData = localStorage.getItem('userData');
            if (storedUserData) {
                const parsedUserData = JSON.parse(storedUserData);
                // console.log("Loaded User Data from localStorage:", parsedUserData);
                const response = await api.get(`get-fields-sessions/`);
                setfields(response.data)
            }
        } catch (error) {
            toast.error('عملیات با شکست مواجه شد');
            console.error('There was an error!', error);
        }
    };
    useEffect(() => {
        fetchSessions();
        fetchUsers();
        fetchLlms()
        fetchfields()
    }, []);



    // Create or Update session
    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            if (selectedSession) {
                // Update session (Update)
                await api.put(`sessions/${selectedSession.id}/`, formData, {
                    headers: {
                        Authorization: userData.token,
                        'Content-Type': 'application/json',
                    }
                });
                toast.success('با موفقیت بروزرسانی شد')
            } else {
                // Create new session (Create)
                await api.post(`sessions/`, formData, {
                    headers: {
                        Authorization: userData.token,
                        'Content-Type': 'application/json',
                    }
                });
                toast.success('با موفقیت ساخته شد')
            }
            fetchSessions();
            setSelectedSession(null);
            setFormData({
                user: '',
                // llm_history: '[]',
                llm: ''
            });
            setmodal(false)
        } catch (error) {
            toast.error('عملیات با شکست مواجه شد');
            console.error('There was an error!', error);
        }
    };

    // Delete session
    const handleDelete = async (id) => {
        try {
            await api.delete(`sessions/${id}/`, {
                headers: {
                    Authorization: userData.token,
                    'Content-Type': 'application/json',
                }
            });
            toast.error('با موفقیت حذف شد')
            setmodaldelete(false)
            fetchSessions();
        } catch (error) {
            toast.error('عملیات با شکست مواجه شد');
            console.error('There was an error!', error);
        }
    };

    // Edit session (Load session data into form for editing)
    const handleEdit = (session) => {
        setSelectedSession(session);
        setmodal(true)
        setFormData({
            id: session.id,
            user: session.user.id, // Assuming you have the user object with an ID
            // llm_history: session.llm_history,
            llm: session.llm.id ? session.llm.id : '' // Assuming you have the llm object with an ID
        });
    };

    const columns = [

        { name: <h3>شناسه</h3>, selector: row => row.id, sortable: true, width: "5%" },
        { name: <h3>شناسه کاربر</h3>, selector: row => <>{row.user.name} {row.user.family}</>, sortable: true, width: "10%" },
        { name: <h3>تاریخ</h3>, selector: row => new Date(row.date).toLocaleString(), sortable: true, width: "20%" },
        { name: <h3>شناسه مدل</h3>, selector: row => row.llm && row.llm.name ? row.llm.name : 'None', sortable: true, width: "10%" },
        { name: <h3>زبان مدل</h3>, selector: row => row.llm && row.llm.language ? row.llm.language : 'None', sortable: true, width: "10%" },
        { name: <h3> تعداد چت</h3>, selector: row => row.chat_count, sortable: true, width: "10%", center: true },
        {
            name: <h3>عملیات</h3>, cell: row => (
                <>
                    {/* <button className={`${style.btn} ${style.lightBlueBtn}`} onClick={() => handleEdit(row)}>ویرایش
                    </button> */}
                    <button className={`${style.btn} ${style.lightBlueBtn}`} onClick={() => handlechat(row)}>چت ها
                    </button>
                    <button className={`${style.btn} ${style.orangeBtn}`} onClick={() => showmodelrow(row, 'model')}>مدل
                    </button>
                    <button className={`${style.btn} ${style.oceanBlueBtn}`} onClick={() => showmodelrow(row, 'user')}>کاربر
                    </button>
                    <button className={`${style.btn} ${style.lightRedBtn}`} onClick={() => setmodaldelete(row.id)}>حذف
                    </button>
                </>
            ),
            width: "30%"
        }
    ];
    const showmodelrow = (session, type) => {
        setSelectedSession(session);
        setmodelllm(type)

    }
    const handlechat = (session) => {
        try {
            setmodalchat(true)
            setSelectedSession(session);
            setFormData({
                id: session.id,
                user: session.user.id, // Assuming you have the user object with an ID
                // llm_history: session.llm_history,
                llm: session.llm.id ? session.llm.id : '' // Assuming you have the llm object with an ID
            });
            api.get(`detail_session/${session.id}/`, {
                headers: {
                    Authorization: userData.token,
                    'Content-Type': 'application/json',
                }
            }).then(resp => {
                setsessionchat(resp.data)

            }).catch(err => {
                console.log(err)
            })
        } catch (error) {
            toast.error('عملیات با شکست مواجه شد');
            console.error('There was an error!', error);
        }
    }
    const closemodal = () => {
        setSelectedSession(null);
        setFormData({
            user: '',
            // llm_history: '[]',
            llm: ''
        });
        setmodal(false)
    }

    const filter_llm_user = (e) => {
        if (e.target.id == 'user') {
            let val = e.target.value

            if (val == "empty") {
                setSessions(data)
                document.getElementById('llm').value = "empty"
                return
            }

            let val2 = document.getElementById('llm').value

            const checkuser = (user) => {
                return user.user.id == val
            }
            let filtered = data.filter(checkuser)
            if (val2 == 'empty') {
                setSessions(filtered)
            } else {
                const checkllm = (llm) => {
                    if (llm.llm == null) {

                    } else {

                        return llm.llm.id == val2
                    }
                }
                let filtered2 = filtered.filter(checkllm)
                setSessions(filtered2)
            }


        } else if (e.target.id == "llm") {
            let val = e.target.value

            if (val == "empty") {
                setSessions(data)
                document.getElementById('user').value = "empty"

                return
            }
            let val2 = document.getElementById('user').value

            const checkllm = (llm) => {
                if (llm.llm == null) {

                } else {

                    return llm.llm.id == val
                }
            }
            let filtered = data.filter(checkllm)
            if (val2 == 'empty') {
                setSessions(filtered)
            } else {
                const checkuser = (user) => {
                    return user.user.id == val2
                }
                let filtered2 = filtered.filter(checkuser)
                setSessions(filtered2)
            }


        }
    }
    const parsetext = (item) => {
        try {
            let msg = JSON.parse(item)
            if (msg.chat) {
                return markdownToHtml(msg.chat)
            } else if (msg.en) {
                return markdownToHtml(msg.en)
            } else if (msg.fa) {
                return markdownToHtml(msg.fa)
            }
        } catch (err) {
            return markdownToHtml(item)
        }
    }
    const fetchpage = async (url) => {
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
            const parsedUserData = JSON.parse(storedUserData);
            // console.log("Loaded User Data from localStorage:", parsedUserData);
            let xurl = url.split('?')

            let urlparams = new URLSearchParams(xurl[1])
            setcountpage(urlparams.get('page'))
            const response = await api.get(`${url}`);

            setnext(response.data.next)
            setprev(response.data.previous)
            setSessions(response.data.results);
            setdata(response.data.results)
        }
    }
    const searchllm = async (e) => {
        setvaluesearch(e)
        // try {
        //     let q = e

        //     const storedUserData = localStorage.getItem('userData');
        //     if (storedUserData) {
        //         const parsedUserData = JSON.parse(storedUserData);
        //         // console.log("Loaded User Data from localStorage:", parsedUserData);

        //         const response = await api.get(`search-sessions/?q=${q}`);
        //         setnext(response.data.next)
        //         setprev(response.data.previous)
        //         setSessions(response.data.results);
        //         setdata(response.data.results)
        //     }
        // } catch (error) {
        //     toast.error('عملیات با شکست مواجه شد');
        //     console.error('There was an error!', error);
        // }
    }

    const searchmodel = async (e) => {
        try {
            let q = e.target.value

            const storedUserData = localStorage.getItem('userData');
            if (storedUserData) {
                const parsedUserData = JSON.parse(storedUserData);
                // console.log("Loaded User Data from localStorage:", parsedUserData);

                const response = await api.get(`search-llms/?q=${q}`);
                setLlms(response.data.results);

            }
        } catch (error) {
            toast.error('عملیات با شکست مواجه شد');
            console.error('There was an error!', error);
        }
    }
    const fetchpagellm = async (url) => {
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
            const parsedUserData = JSON.parse(storedUserData);
            // console.log("Loaded User Data from localStorage:", parsedUserData);

            const response = await api.get(`${url}`);

            setLlms(response.data.results);
            setmorellm(response.data.next)
        }
    }
    const filtersession = async (event) => {
        try {
            let start = document.getElementById('start_date').value
            let end = document.getElementById('end_date').value
            let chat_count = document.getElementById('chat_count').value
            let sortselect = document.getElementById('sortselect').value
            const storedUserData = localStorage.getItem('userData');
            let q = `sessions/?`
            if (storedUserData) {
                if (valuesearch) {
                    q = `${q}q=${valuesearch}&`
                }
                if (start && end) {
                    q = `${q}start_date=${start}&end_date=${end}&`
                }
                if (chat_count) {
                    q = `${q}min_chat_count=${chat_count}&`
                }

                if (sortselect) {
                    q = `${q}sorted_by=${sortselect}&`
                }
                if (llmsearch) {
                    q = `${q}llm_id=${llmsearch}&`

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
                setnext(response.data.next)
                setprev(response.data.previous)
                setSessions(response.data.results);
                setdata(response.data.results)
                setcountpage(null)


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
        api.post(`delete-session/`, josndata).then(resp => {
            // console.log(resp.data)
            setselectrow(null)
            fetchSessions()
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
    const downloadchat = (id) => {
        api.get(`get_excel_session/${id}/`, {
            responseType: 'blob'
        }).then(resp => {
            console.log(resp.data)
            const url = window.URL.createObjectURL(new Blob([resp.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'export.xlsx');
            link.click();
        }).catch(err => {
            console.log(err)
        })
    }
    const clearborderllm = () => {
        for (let i in llms) {
            document.getElementById(`llmid_${llms[i].id}`).style.border = "none"
        }
    }
    return (
        <div>
            <ToastContainer />
            {modelllm && <div id="myModal" className={style.modal}>

                <div className={style.modalcontent}>
                    <span className={style.close} onClick={() => setmodelllm(false)}>&times;</span>
                    <br />
                    {modelllm == "model" ? <>
                        <div>
                            <h2>اطلاعات مدل </h2>
                            <br />
                            <div className={style.rowField}>
                                <label htmlFor="name">نام</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={selectedSession.llm['name']}

                                    placeholder="LLM نام"
                                />
                            </div>

                            <div className={style.rowField}>
                                <label htmlFor="version">نگارش</label>
                                <input
                                    type="text"
                                    name="version"
                                    value={selectedSession.llm['version']}
                                    placeholder="نگارش مدل"
                                />
                            </div>
                            <div className={style.rowField}>
                                <label htmlFor="description">تاریخچه LLM</label>
                                <textarea
                                    name="description"
                                    rows="4"
                                    cols="40"
                                    value={selectedSession.llm['description']}
                                    placeholder="LLM تاریخچه"
                                ></textarea>
                            </div>
                            <div className={style.rowField}>
                                <label htmlFor="language">language</label>
                                <input
                                    type="text"
                                    name="language"
                                    value={selectedSession.llm['language']}
                                    placeholder="LLM language"

                                />
                            </div>
                        </div>
                    </> : ""}

                    {modelllm == "user" ? <>
                        <h2>اطلاعات کاربر</h2>
                        <br />
                        <div className={style.rowField}>
                            <label htmlFor="email">ایمیل</label>
                            <input
                                type="email"
                                name="email"
                                value={selectedSession.user['email']}
                                placeholder="ایمیل"

                            />
                        </div>

                        <div className={style.rowField}>
                            <label htmlFor="username">شناسه کاربری</label>
                            <input
                                type="text"
                                name="username"
                                value={selectedSession.user['username']}
                                placeholder="شناسه کاربری"

                            />
                        </div>

                        <div className={style.rowField}>
                            <label htmlFor="name">نام</label>
                            <input
                                type="text"
                                name="name"
                                value={selectedSession.user['name']}
                                placeholder="نام"

                            />
                        </div>

                        <div className={style.rowField}>
                            <label htmlFor="family">نام خانوادگی</label>
                            <input
                                type="text"
                                name="family"
                                value={selectedSession.user['family']}
                                placeholder="نام خانوادگی"

                            />
                        </div>

                        <div className={style.rowField}>
                            <label htmlFor="image">آواتار</label>
                            <input
                                type="text"
                                name="image"
                                value={selectedSession.user['image']}
                                placeholder="تصویر کاربر"
                            />
                        </div>

                    </> : ""}

                </div>
            </div>}
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
            {modalchat && <div id="myModal" className={style.modal}>

                <div className={style.modalcontent}>
                    <span className={style.close} onClick={() => setmodalchat(false)}>&times;</span>
                    <br />
                    <div>{selectedSession && <>
                        <div>
                            <table style={{ width: "100%" }} border="0">
                                <tr>
                                    <td>
                                        <h5>مدل : {selectedSession.llm['name']}</h5>
                                    </td>
                                    <td>
                                        <h5>کاربر : {selectedSession.user['name']} {selectedSession.user['family']}</h5>

                                    </td>
                                    <td>
                                        <h5>ایمیل : {selectedSession.user['email']} </h5>

                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <h5>تعداد چت ها : {sessionchat && sessionchat.length}</h5>

                                    </td>
                                    <td>
                                        <h5> زبان چت : {selectedSession && selectedSession.llm['language']}</h5>

                                    </td>
                                    {sessionchat && sessionchat.length > 0 ? <td>
                                        <button className={`${style.btn} ${style.lightBlueBtn}`} onClick={() => downloadchat(selectedSession.id)}>دانلود فایل چت</button>
                                    </td> : ""}
                                    
                                </tr>
                            </table>


                        </div>

                    </>}</div>
                    <br />
                    <div className={style.modalChatBox}>
                        {sessionchat && sessionchat.map(mp => <div key={mp.id}>
                            {mp.side === "CHAT" && <div>
                                <div className={style.userMessage} >
                                    <div className={style.userAvatar}>
                                        <Image
                                            src={mp.session['user'] && mp.session['user'].image && mp.session['user'].image !== 'None' ? `${mp.session['user'].image}` : "/img/avatar.svg"}
                                            alt={"کاربر"} width={128} height={128} />
                                    </div>
                                    <div className={style.messageContent}>
                                        <h2 className={style.personName}>
                                            <span>{mp.session['user'].name} {mp.session['user'].family}</span>
                                            <div className={style.modalChatDetails}>
                                                <span className={style.modalChatDate}>{mp.date}</span>
                                                <span
                                                    className={style.modalChatId}>{mp.rating == null ? <>0</> : <>{mp.rating}</>}</span>
                                                {/* <span className={style.modalChatId}>{mp.id}</span> */}
                                            </div>
                                        </h2>
                                        <div dangerouslySetInnerHTML={{ __html: parsetext(mp.textbox) }}></div>
                                    </div>
                                </div>

                            </div>}


                            {mp.side === "AI" && <div>
                                <div className={style.systemMessage}>
                                    <div className={style.systemAvatar}>
                                        <Image src={"/img/khatamBot.svg"} alt={"دستیار خاتم"} width={128}
                                            height={128} />
                                    </div>
                                    <div className={style.messageContent}>
                                        <h2 className={style.personName}>
                                            <span>دستیار هوشمند خاتم</span>
                                            <div className={style.modalChatDetails}>
                                                <span className={style.modalChatDate}>{mp.date}</span>
                                                <span className={style.modalChatId}>{mp.rating == null ? <>0</> : <>{mp.rating}</>}</span>
                                            </div>
                                        </h2>
                                        <div dangerouslySetInnerHTML={{ __html: parsetext(mp.textbox) }}></div>
                                    </div>
                                </div>
                            </div>}
                        </div>)}
                        {sessionchat && sessionchat.length == 0 ? <>
                            <center>
                                <br />
                                <br />
                                <h2>هیچ پیامی موجود نیست</h2>
                            </center>
                        </> : ""}
                    </div>
                </div>
            </div>
            }
            {/* <button className={style.createBtn} onClick={() => setmodal(true)} disabled={true}>افزودن سشن جدید</button> */}

            {/* {users && <select className={style.filterSelect} id='user' onChange={(e) => filter_llm_user(e)}>
                <option value={'empty'}>انتخاب کاربر</option>
                {users.map(mp => <option key={mp.id} value={mp.id}>
                    {mp.name} {mp.family}
                </option>)}
            </select>} */}

            {/* {llms && <select className={style.filterSelect} id='llm' onChange={(e) => filter_llm_user(e)}>
                <option value={'empty'}>انتخاب مدل</option>

                {llms.map(mp => <option key={mp.id} value={mp.id}>
                    {mp.name}
                </option>)}
            </select>} */}

            <div className={style.rowField}>
                {selectrow && <>
                    <button className={`${style.btn} ${style.lightRedBtn}`} onClick={() => deleteselect()}> حذف موارد انتخاب شده </button>
                    <button className={`${style.btn} ${style.lightBlueBtn}`} onClick={() => handlecleartable()}> لغو   </button>

                </>}

                {/* <button className={`${style.btn} ${style.lightBlueBtn}`} onClick={() => {
                    fetchSessions()
                    document.getElementById('qllm').value = ""
                }}>
                    بازنشانی فیلتر
                </button> */}
            </div>
            {modal && <div id="myModal" className={style.modal}>

                <div className={style.modalcontent}>
                    <span className={style.close} onClick={() => closemodal()}>&times;</span>
                    <br />
                    <form onSubmit={handleSubmit}>
                        <div className={style.rowField}>
                            <label htmlFor="user">کاربر</label>
                            <select
                                type="text"
                                name="user"
                                value={formData.user}
                                // onChange={e => setFormData({ ...formData, user: e.target.value })}
                                placeholder="شناسه کاربر"

                            >
                                {users.map(mp => <option key={mp.id} value={mp.id}>
                                    {mp.name} {mp.family}
                                </option>)}
                            </select>
                        </div>
                        {/* <div className={style.rowField}>
                            <label htmlFor="llm_history">تاریخچه LLM</label>
                            <textarea
                                name="llm_history"
                                rows="4" cols="40"
                                value={formData.llm_history}
                                onChange={e => setFormData({ ...formData, llm_history: e.target.value })}
                                placeholder="LLM تاریخچه"
                            >
                            </textarea>
                        </div> */}
                        <div className={style.rowField}>
                            <label htmlFor="llm">شناسه LLM</label>
                            <select
                                type="text"
                                name="llm"
                                value={formData.llm}
                                // onChange={e => setFormData({ ...formData, llm: e.target.value })}
                                placeholder="LLM ID"
                            >
                                {llms.map(mp => <option key={mp.id} value={mp.id}>
                                    {mp.name}
                                </option>)}
                            </select>
                        </div>
                        {/* <div className={style.rowField}>
                            <button type="submit">{selectedSession ? 'بروزرسانی سشن' : 'ایجاد سشن'}</button>
                        </div> */}
                    </form>
                </div>
            </div>}
            <div className={style.sessionsContentContainer}>
                <div className={style.sessionFilter}>
                    <div className={style.filterBox}>
                        <h5> دانلود فایل   </h5>
                        <button className={`${style.btn} ${style.lightBlueBtn}`} onClick={() => filtersession('csv')}>دانلود خروجی</button>
                    </div>
                    <div className={style.filterBox}>
                        <h5>فیلتر بر اساس مدل، ایمیل و کاربر</h5>
                        <div className={style.rowFilter}>
                            <input type='text' placeholder='نام مدل، ایمیل، کاربر' id='qllm' onChange={(e) => searchllm(e.target.value)} />
                        </div>

                    </div>
                    <div className={style.filterBox}>
                        <h5>فیلتر بر اساس تعداد چت</h5>
                        <div className={style.rowFilter}>
                            <input type='number' id='chat_count' placeholder='تعداد چت' />
                        </div>
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
                        <h5>فیلتر بر اساس مدل </h5>
                        <div className={style.rowFilter}>
                            <input id='fllm' onChange={(e) => searchmodel(e)} placeholder='نام مدل مورد نظر' />
                            <button className={`${style.btn} ${style.lightBlueBtn}`} onClick={() => {
                                fetchLlms()
                                document.getElementById('fllm').value = ""
                            }}>
                                بازنشانی فیلتر مدل ها
                            </button>
                        </div>
                        <div className={style.filterLlms}>
                            {llms && llms.map(mp => <div id={`llmid_${mp.id}`} key={mp.id} className={style.filterLlmName}
                                onClick={() => {
                                    setllmsearch(mp.id)
                                    clearborderllm()
                                    document.getElementById(`llmid_${mp.id}`).style.border = "1px green solid"
                                }}>
                                {mp.name}
                            </div>)}
                        </div>

                        {morellm && <button onClick={() => fetchpagellm(morellm)}>نمایش بیشتر مدل ها</button>}

                    </div>
                    <div className={style.filterBox}>
                        <h5>مرتب سازی بر اساس فیلد</h5>
                        <div>
                            {fields && <select id='sortselect'>
                                <option value={""}>فیلد مورد نظر را انتخاب کنید</option>
                                {fields.fields.map((mp, key) => <option key={`${mp}${key}`} value={mp}>
                                    {mp}
                                </option>)}
                                {fields.fields.map((mp, key) => <option key={key} value={`${mp} desc`}>
                                    {mp} desc
                                </option>)}
                            </select>}
                        </div>
                    </div>
                    <div className={`${style.filterBox} ${style.filterBtns}`}>
                        <button className={`${style.btn} ${style.lightBlueBtn}`} onClick={() => filtersession()}>
                            اعمال فیلتر
                        </button>
                        <button className={`${style.btn} ${style.lightBlueBtn}`} onClick={() => {
                            fetchSessions()
                        }}>
                            بازنشانی کل فیلتر
                        </button>
                    </div>
                </div>
                <div className={style.sessionsTable}>
                    <div className={style.dataTableContainer}>
                        <DataTable
                            title={<h4>لیست سشن ها</h4>}
                            columns={columns}
                            data={sessions}
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
                                    className={`${style.btn} ${style.lightBlueBtn}`} >
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

export default CRUDSessionComponent;