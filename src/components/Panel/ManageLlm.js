
import React, { useEffect, useState } from 'react';
import api from '@/utils/api'
import DataTable from 'react-data-table-component';
import style from './Manage.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE_URL =   `${process.env.NEXT_PUBLIC_BASE_URL}`

const CRUDLlmComponent = () => {
    const [llms, setLlms] = useState([]);
    const [modal, setModal] = useState(false);
    const [selectedLlm, setSelectedLlm] = useState(null);
    const [llmList, setLlmList] = useState(null);
    const [modalDetail, setModalDetail] = useState(false);
    const [ev, setEv] = useState('1');
    const [llmId, setLlmId] = useState(null);
    const [icondata, seticondata] = useState(null)
    const [modalpromp, setmodalpromp] = useState(false)
    const [modaldelete, setmodaldelete] = useState(false)
    const [countpage, setcountpage] = useState(false)
    const [selectrow, setselectrow] = useState(null)
    const [clearselect, setclearselect] = useState(false)

    const [records, setRecords] = useState([]);
    const [form, setForm] = useState({ name: '', tr_address1: '', tr_address2: '', type: 'FA' });
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [evtrans, setevtrans] = useState(null)
    const [deltransdata, setdeltransdata] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        version: '',
        description: '',
        icon: null, // اضافه شدن فیلد icon
        language: "",
        is_use_mq: false,
        max_llm_history: "",
        llm_input_language: "",
        transalte_fa: "",
        transalte_en: "",
        response_language:"" ,
    });

    const [llmServerData, setLlmServerData] = useState({
        name: '',
        url_address: '',
        url_address2: '',
        llm: '',
    });

    const [selectedServer, setSelectedServer] = useState(null); // حالت جدید برای سرور انتخاب شده

    const [userData, setUserData] = useState(null);

    const [prompts, setPrompts] = useState([]);
    const [textbox, setTextbox] = useState('');
    const [llm, setLlm] = useState('');
    const [prompid, setprompid] = useState('');
    const [editingPrompt, setEditingPrompt] = useState(null);
    const [next, setnext] = useState(null)
    const [prev, setprev] = useState(null)
    const [serviceData, setServiceData] = useState([])
    const [englishServices, setEnglishServices] = useState([]);
    const [farsiServices, setFarsiServices] = useState([]);
    const [modalenfa, setmodalenfa] = useState(false)

    useEffect(() => {
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
            const parsedUserData = JSON.parse(storedUserData);
            setUserData(parsedUserData);
            // console.log("Loaded User Data from localStorage:", parsedUserData);
        }
    }, []);



    const fetchLlms = async () => {
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
            const parsedUserData = JSON.parse(storedUserData);
            // console.log("Loaded User Data from localStorage:", parsedUserData);
            const response = await api.get(`llms/`);
            setLlms(response.data.results);
            setnext(response.data.next)
            setprev(response.data.previous)
        }
    };

    useEffect(() => {
        fetchLlms();
    }, []);

    const handleSubmit = async (e) => {
        console.log(formData);


        try {
            e.preventDefault();
            const data = new FormData();
            data.append('name', formData.name);
            data.append('version', formData.version);
            data.append('description', formData.description);
            data.append('language', formData.language);
            data.append('is_use_mq', formData.is_use_mq)
            data.append('max_llm_history', formData.max_llm_history)
            data.append('llm_input_language', formData.llm_input_language)
            data.append('transalte_en', formData.transalte_en)
            data.append('transalte_fa', formData.transalte_fa)
            data.append('response_language', formData.response_language)



            if (formData.icon) {
                data.append('icon', formData.icon); // اضافه کردن فایل به فرم دیتا
            }
            if (selectedLlm) {

                await api.put(`llms/${selectedLlm.id}/`, data, {
                    headers: {
                        Authorization: userData.token,
                        'Content-Type': 'multipart/form-data',
                    },
                });

                toast.success('با موفقیت به روز رسانی شد');
            } else {
                await api.post(`llms/`, data, {
                    headers: {
                        Authorization: userData.token,
                        'Content-Type': 'multipart/form-data',
                    },
                });
                toast.success('با موفقیت ساخته شد');
            }
            fetchLlms();
            setModal(false);
            setSelectedLlm(null);
            setFormData({
                name: '',
                version: '',
                description: '',
                icon: null,
                language: "",
                is_use_mq: false,
                max_llm_history: "",
                llm_input_language: "",
                transalte_fa: "",
                transalte_en: "",
                response_language:""


            });
        } catch (error) {
            toast.error('عملیات با شکست مواجه شد');
            console.error('There was an error!', error);
        }
    };

    const handleServerSubmit = async (e) => {

        e.preventDefault();
        try {
            let sendata = llmServerData;
            sendata['llm'] = llmId;

            if (selectedServer) {
                await api.put(`updateLlm/${selectedServer.id}/`, sendata, {
                    headers: {
                        Authorization: userData.token,
                        'Content-Type': 'application/json',
                    },
                });
                api
                    .get(`getLlm/${llmId}/`, {
                        headers: {
                            Authorization: userData.token,
                            'Content-Type': 'application/json',
                        },
                    })
                    .then((resp) => {
                        setLlmList(resp.data.llmserver_set);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
                toast.success('با موفقیت بروزرسانی شد!');
            } else {
                await api.post(`createLlm/${llmId}/`, sendata, {
                    headers: {
                        Authorization: userData.token,
                        'Content-Type': 'application/json',
                    },
                });
                api
                    .get(`getLlm/${llmId}/`, {
                        headers: {
                            Authorization: userData.token,
                            'Content-Type': 'application/json',
                        },
                    })
                    .then((resp) => {
                        setLlmList(resp.data.llmserver_set);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
                toast.success('با موفقیت ساخته شد');
            }
            setEv('1'); // Return to the server list view after creation or update
        } catch (error) {
            toast.error('عملیات با شکست مواجه شد');
            console.error('There was an error!', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`llms/${id}/`, {
                headers: {
                    Authorization: userData.token,
                    'Content-Type': 'application/json',
                },
            });
            toast.error('با موفقیت حذف شد!');
            fetchLlms();
            setmodaldelete(false)
        } catch (error) {
            toast.error('عملیات با شکست مواجه شد');
            console.error('There was an error!', error);
        }
    };

    const handleDetail = (llm) => {
        try {
            setModalDetail(true);
            setSelectedLlm(llm);
            setLlmId(llm.id);
            setLlmServerData({ ...llmServerData, llm: llm.id });
            api
                .get(`getLlm/${llm.id}/`, {
                    headers: {
                        Authorization: userData.token,
                        'Content-Type': 'application/json',
                    },
                })
                .then((resp) => {
                    setLlmList(resp.data.llmserver_set);
                })
                .catch((err) => {
                    console.log(err);
                });
        } catch (error) {
            toast.error('عملیات با شکست مواجه شد');
            console.error('There was an error!', error);
        }
    };

    const handleEdit = (llm) => {
        console.log(llm)
        setSelectedLlm(llm);
        setFormData({
            name: llm.name,
            version: llm.version,
            description: llm.description,
            icon: '', // فایل icon در فرم ادیت نمایش داده نمی‌شود، اما می‌تواند تغییر یابد
            language: llm.language,
            is_use_mq: llm.is_use_mq,
            max_llm_history: llm.max_llm_history,
            llm_input_language: llm.llm_input_language,
            transalte_fa: llm.transalte_fa,
            transalte_en: llm.transalte_en,
            response_language:llm.response_language


        });
        seticondata(llm.icon)
        setModal(true);

    };

    const handleServerEdit = (server) => {
        setSelectedServer(server);
        setLlmServerData({
            name: server.name,
            url_address: server.url_address,
            url_address2: server.url_address2,
            llm: server.llm,
        });
        setEv('2'); // Switch to the server edit form
    };


    const columns = [
        { name: <h3>نام</h3>, selector: (row) => row.name, sortable: true, width: "10%" },
        { name: <h3>نسخه/نگارش</h3>, selector: (row) => row.version, sortable: true, width: "10%" },
        { name: <h3>تاریخ</h3>, selector: (row) => new Date(row.date).toLocaleString(), sortable: true, width: "10%" },
        { name: <h3>تعداد سرور</h3>, selector: (row) => row.server_count, sortable: true, width: "10%" },
        {
            name: <h3>استفاده از صف چین </h3>, selector: (row) => <>
                {row.is_use_mq == true ? "فعال" : "غیرفعال"}
            </>, sortable: true, width: "10%"
        },


        {
            name: <h3>عملیات</h3>,
            cell: (row) => (
                <>
                    <button className={`${style.btn} ${style.lightBlueBtn}`} onClick={() => {
                        handleEdit(row)
                        handleAdd()
                    }}>
                        ویرایش
                    </button>
                    <button className={`${style.btn} ${style.orangeBtn}`} onClick={() => handleDetail(row)}>
                        سرور
                    </button>
                    <button className={`${style.btn} ${style.oceanBlueBtn}`} onClick={() => handleDetailpromp(row)}>
                        پرامپت
                    </button>

                    <button className={`${style.btn} ${style.lightRedBtn}`} onClick={() => setmodaldelete(row.id)}>
                        حذف
                    </button>
                </>
            ),
            width: "45%"
        },
    ];

    const handleDetailpromp = async (llm) => {

        try {
            const response = await api.get(`getDefaultPrompts/${llm.id}/`, {
                headers: {
                    Authorization: userData.token,
                    'Content-Type': 'application/json',
                },
            });
            setLlm(llm.id)
            setLlmId(llm.id)
            setmodalpromp(true)
            setPrompts(response.data);
        } catch (error) {
            toast.error('عملیات با شکست مواجه شد');
            console.error('There was an error!', error);
        }
    }

    const closeModal = () => {
        setLlmList(null);
        setSelectedLlm(null);
        setModal(false);
        setFormData({
            name: '',
            version: '',
            description: '',
            icon: null,
            language: "",
            is_use_mq: false,
            max_llm_history: "",
            llm_input_language: ""
        });
        seticondata(null)
    };

    const handleServerDelete = (llmServer) => {
        try {
            api.delete(`deleteLlm/${llmServer.id}/`, {
                headers: {
                    Authorization: userData.token,
                    'Content-Type': 'application/json',
                },
            }).then(resp => {
                api
                    .get(`getLlm/${llmId}/`, {
                        headers: {
                            Authorization: userData.token,
                            'Content-Type': 'application/json',
                        },
                    })
                    .then((resp) => {
                        setLlmList(resp.data.llmserver_set);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
                toast.success('با موفقیت حذف شد');
                setEv("1");
            }).catch(err => {
                console.log(err);
            });
        } catch (error) {
            toast.error('عملیات با شکست مواجه شد');
            console.error('There was an error!', error);
        }
    };





    // Handle create prompt
    const handleCreate_promp = async (event) => {
        event.preventDefault();
        try {
            await api.post(`createDefaultPrompts/${llmId}/`, { textbox, llm }, {
                headers: {
                    Authorization: userData.token,
                    'Content-Type': 'application/json',
                },
            });
            setTextbox('');
            setLlm('');
            setprompid('')
            await fetchPrompts(llmId); // Refresh the list
            toast.success(" با موفقیت ساخته شد")
        } catch (error) {
            toast.error('عملیات با شکست مواجه شد');
            console.error('There was an error!', error);
        }
    };

    // Handle update prompt
    const handleUpdate_promp = async (event) => {
        event.preventDefault();
        try {
            await api.put(`updateDefaultPrompts/${prompid}/`, { textbox, llm }, {
                headers: {
                    Authorization: userData.token,
                    'Content-Type': 'application/json',
                },
            });
            await fetchPrompts(llm.id); // Refresh the list
            setEditingPrompt(null);
            setTextbox('');
            setprompid('')
            setLlm('');
            toast.success("با موفقیت بروزرسانی شد !")
        } catch (error) {
            toast.error('عملیات با شکست مواجه شد');
            console.error('There was an error!', error);
        }
    };

    // Handle delete prompt
    const handleDelete_promp = async (id) => {
        try {
            await api.delete(`deleteDefaultPrompts/${id}/`, {
                headers: {
                    Authorization: userData.token,
                    'Content-Type': 'application/json',
                },
            });
            await fetchPrompts(llmId); // Refresh the list
        } catch (error) {
            toast.error('عملیات با شکست مواجه شد');
            console.error('There was an error!', error);
        }
    };

    // Handle editing prompt
    const handleEdit_promp = (prompt) => {
        setEditingPrompt(prompt);
        setTextbox(prompt.textbox);
        setprompid(prompt.id)
        setLlm(prompt.llm);
        setLlmId(prompt.id)
    };

    // Refresh prompts list
    const fetchPrompts = async (id) => {
        try {
            const response = await api.get(`getDefaultPrompts/${id}/`, {
                headers: {
                    Authorization: userData.token,
                    'Content-Type': 'application/json',
                },
            }); setPrompts(response.data);
        } catch (error) {
            toast.error('عملیات با شکست مواجه شد');
            console.error('There was an error!', error);
        }
    };

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
                setLlms(response.data.results);
                setnext(response.data.next)
                setprev(response.data.previous)
            }
        } catch (error) {
            toast.error('عملیات با شکست مواجه شد');
            console.error('There was an error!', error);
        }
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
        api.post(`delete-llm/`, josndata).then(resp => {
            // console.log(resp.data)
            setselectrow(null)
            fetchLlms()
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


    const handleAdd = async () => {
        setModal(true)

        try {
            const response = await api.get("/services/", {
                headers: {
                    "Authorization": userData.token,
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log(response.data);
            setServiceData(response.data);

            const enServices = response.data.filter(service => service.type === "EN");
            const faServices = response.data.filter(service => service.type === "FA");

            setEnglishServices(enServices);
            setFarsiServices(faServices);

        } catch (err) {
            toast.error("There Is Something Wrong!!", {
                position: "bottom-right",
            });
        }
    }


    const fetchRecords = async () => {
        try {
            const response = await api.get("/services/", {
                headers: {
                    "Authorization": userData.token,
                    "Content-Type": "multipart/form-data",
                },
            });

            setRecords(response.data);


        } catch (err) {
            toast.error("There Is Something Wrong!!", {
                position: "bottom-right",
            });
        }
    }
    const transalte = async () => {
        setmodalenfa(true)
        fetchRecords()
        setevtrans(1)

    }


    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit_trans = async e => {
        e.preventDefault();
        try {
            if (isEditing) {
                await api.put(`/services/${editingId}/`, form);
                setIsEditing(false);
                setEditingId(null);
                toast.success('عملیات مورد نظر با موفقیت انجام شد')
            } else {
                await api.post('/services/', form);
                toast.success('عملیات مورد نظر با موفقیت انجام شد')
            }
            setForm({ name: '', tr_address1: '', tr_address2: '', type: 'FA' });
            fetchRecords();
            setevtrans(1)
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error('عملیات با شکست مواجه شد');

        }
    };

    // شروع ویرایش رکورد
    const handleEdit_trans = record => {
        setForm(record);
        setIsEditing(true);
        setEditingId(record.id);
        setevtrans(2)
    };

    // حذف رکورد
    const handleDelete_trans = async (id) => {
        try {
            await api.delete(`/services/${id}/`);
            fetchRecords();
            toast.success('عملیات مورد نظر با موفقیت انجام شد')
            setevtrans(1)

        } catch (error) {
            console.error("Error deleting record:", error);
            toast.error('عملیات با شکست مواجه شد');

        }
    };
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
                        <button onClick={() => handleDelete(modaldelete)} className={`${style.btn} ${style.lightRedBtn}`}>
                            حذف
                        </button>
                        <button onClick={() => setmodaldelete(false)} className={`${style.btn} ${style.lightBlueBtn}`}>
                            لغو
                        </button>
                    </center>
                </div>
            </div>}
            <div className={style.rowField}>
                <button className={style.createBtn} onClick={() => transalte()}>
                    مدیریت بخش ترجمه
                </button>
                &nbsp;
                <button className={style.createBtn} onClick={handleAdd}>
                    افزودن مدل جدید
                </button>
                <input type='text' placeholder='نام مدل' id='qmodel' onChange={(e) => searchmodel(e)} />
                <button className={`${style.btn} ${style.lightBlueBtn}`} onClick={() => {
                    fetchLlms()
                    document.getElementById('qmodel').value = ""
                }}>
                    بازنشانی فیلتر
                </button>
                {selectrow && <>
                    <button className={`${style.btn} ${style.lightRedBtn}`} onClick={() => deleteselect()}> حذف موارد انتخاب شده </button>
                    <button className={`${style.btn} ${style.lightBlueBtn}`} onClick={() => handlecleartable()}> لغو   </button>

                </>}
            </div>
            {modalenfa && <div id="myModal" className={style.modal}>
                <div className={style.modalcontent}>
                    <span className={style.close} onClick={() => setmodalenfa(false)}>
                        &times;
                    </span>
                    <div className={style.recordManagerModal}>
                        <h2>مدیریت بخش ترجمه</h2>
                        {evtrans == 1 ? <>
                            <button className={`${style.btn} ${style.lightBlueBtn}`} onClick={() => setevtrans(2)}>ساخت
                                رکورد جدید
                            </button>
                            <ul>

                                <br />
                                {records.map(record => (
                                    <li key={record.id}>
                                        <div className={style.recordDetails}>
                                            <div className={style.recordDetail}>
                                                <span>نام:</span>
                                                <span>{record.name}</span>
                                            </div>
                                            <div className={style.recordDetail}>
                                                <span>آدرس شماره یک:</span>
                                                <span>{record.tr_address1}</span>
                                            </div>
                                            <div className={style.recordDetail}>
                                                <span>آدرس شماره دو:</span>
                                                <span>{record.tr_address2}</span>
                                            </div>
                                            <div className={style.recordDetail}>
                                                <span>نوع:</span>
                                                <span>{record.type}</span>
                                            </div>
                                        </div>
                                        <div className={style.modalActionBtns}>
                                            <button className={`${style.btn} ${style.oceanBlueBtn}`}
                                                onClick={() => handleEdit_trans(record)}>ویرایش
                                            </button>
                                            <button className={`${style.btn} ${style.lightRedBtn}`}
                                                onClick={() => {
                                                    setdeltransdata(record.id)
                                                    setevtrans(3)
                                                }}>حذف
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </> : <></>}
                        {evtrans == 2 ? <>
                            <button onClick={() => {
                                setevtrans(1)
                                setForm({ name: '', tr_address1: '', tr_address2: '', type: 'FA' });
                            }} className={`${style.btn} ${style.lightBlueBtn}`}>  بازگشت به لیست</button>
                            <br />
                            <form onSubmit={handleSubmit_trans} className={style.modelManageCreateForm}>
                                <div className={style.rowField}>
                                    <label htmlFor="name">نام</label>
                                    <input
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="نام"
                                        required
                                    />
                                </div>
                                <div className={style.rowField}>
                                    <label htmlFor="tr_address1">آدرس یک</label>
                                    <input
                                        name="tr_address1"
                                        value={form.tr_address1}
                                        onChange={handleChange}
                                        placeholder="آدرس 1"
                                        required
                                    />
                                </div>
                                <div className={style.rowField}>
                                    <label htmlFor="tr_address2">آدرس دو</label>
                                    <input
                                        name="tr_address2"
                                        value={form.tr_address2}
                                        onChange={handleChange}
                                        placeholder="آدرس 2"
                                        required
                                    />
                                </div>
                                <div className={style.rowField}>
                                    <label htmlFor="type">نوع</label>
                                    <select name="type" value={form.type} onChange={handleChange} required>
                                        <option value="FA">FA</option>
                                        <option value="EN">EN</option>
                                    </select>
                                </div>
                                <div className={style.rowField}>
                                    <button type="submit">{isEditing ? 'ویرایش' : 'ثبت'}</button>
                                </div>
                            </form>
                        </> : ""}
                        {evtrans == 3 ? <>
                            <center>
                                <p>ایاعملیات حذف انجام شود</p>
                                <button onClick={() => handleDelete_trans(deltransdata)}
                                    className={`${style.btn} ${style.lightRedBtn}`}>
                                    حذف
                                </button>
                                <button onClick={() => setevtrans(1)} className={`${style.btn} ${style.lightBlueBtn}`}>
                                    لغو
                                </button>
                            </center>
                        </> : ""}

                    </div>
                    <br />
                </div>
            </div>}

            {modalpromp && <>
                <div id="myModal" className={style.modal}>
                    <div className={style.modalcontent}>
                        <span className={style.close} onClick={() => setmodalpromp(false)}>
                            &times;
                        </span>
                        <br />

                        <form onSubmit={editingPrompt ? handleUpdate_promp : handleCreate_promp}>
                            <textarea
                                className={style.textBox}
                                value={textbox}
                                onChange={(e) => setTextbox(e.target.value)}
                                placeholder="محتوای پرامت را وارد کنید..."
                            />
                            <div className={style.rowField}>
                                <button type="submit">{editingPrompt ? 'بروزرسانی پرامپت' : 'ایجاد پرامپت'}</button>
                                {editingPrompt && (
                                    <button className={`${style.btn} ${style.lightBlueBtn}`} type="button" onClick={() => {
                                        setEditingPrompt(null)
                                        setTextbox('')

                                    }}>لغو</button>
                                )}
                            </div>
                        </form>
                        <hr />

                        <ul className={style.promptList}>
                            {prompts && prompts.map((prompt) => (
                                <li className={style.flexSpace} key={prompt.id}>
                                    <div className={style.flexNormal}>
                                        <span>پرامت شماره</span><span>{prompt.textbox}</span>
                                    </div>
                                    <div className={style.flexNormal}>
                                        <button className={`${style.btn} ${style.lightBlueBtn}`}
                                            onClick={() => handleEdit_promp(prompt)}>ویرایش
                                        </button>
                                        <button className={`${style.btn} ${style.lightRedBtn}`}
                                            onClick={() => handleDelete_promp(prompt.id)}>حذف
                                        </button>

                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </>}
            {modal && (
                <div id="myModal" className={style.modal}>
                    <div className={style.modalcontent}>
                        <span className={style.close} onClick={() => closeModal()}>
                            &times;
                        </span>
                        <br />
                        <form onSubmit={handleSubmit}>
                            <div className={style.rowField}>
                                <label htmlFor="name">نام</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="LLM نام"

                                />
                            </div>

                            <div className={style.rowField}>
                                <label htmlFor="version">نگارش</label>
                                <input
                                    type="text"
                                    name="version"
                                    value={formData.version}
                                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                                    placeholder="نگارش مدل"
                                />
                            </div>
                            <div className={style.rowField}>
                                <label htmlFor="version">تعداد استفاده از پیام </label>
                                <input
                                    type="number"
                                    name="max_llm_history"
                                    value={formData.max_llm_history}
                                    onChange={(e) => setFormData({ ...formData, max_llm_history: e.target.value })}
                                    placeholder="تعداد استفاده از پیام "
                                />
                            </div>
                            <div className={style.rowField}>
                                <label htmlFor="version">زبان ورودی مدل زبانی</label>
                                <select
                                    type="number"
                                    name="max_llm_history"
                                    value={formData.llm_input_language}
                                    onChange={(e) => setFormData({ ...formData, llm_input_language: e.target.value })}
                                    placeholder="زبان ورودی مدل زبانی"
                                >
                                    <option value={"FA"}>
                                        فارسی
                                    </option>
                                    <option value={"EN"}>
                                        انگلیسی
                                    </option>
                                    <option value={"EN-FA"}>
                                        فارسی-انگلیسی
                                    </option>
                                </select>
                            </div>
                            <div className={style.rowField}>
                                <label htmlFor="version">مدیریت زبان خروجی</label>
                                <select
                                    type="number"
                                    name="response_language"
                                    value={formData.response_language}
                                    onChange={(e) => setFormData({ ...formData, response_language: e.target.value })}
                                    placeholder="مدیریت زبان خروجی<"
                                >
                                    <option value={"FA"}>
                                        فارسی
                                    </option>
                                    <option value={"EN"}>
                                        انگلیسی
                                    </option>
                                    <option value={"NO-TRANSLATE"}>
                                       بدون ترجمه
                                    </option>
                                </select>
                            </div>
                            <div className={style.rowField}>
                                <label>سرویس ترجمه انگلیسی</label>
                                <select
                                    name="transalte_en"
                                    value={formData.transalte_en}
                                    onChange={(e) => setFormData({ ...formData, transalte_en: e.target.value })}
                                >
                                    <option value="" disabled hidden>
                                        لطفا یک گزینه انتخاب کنید
                                    </option>
                                    {englishServices.map((service) => (
                                        <option key={service.id} value={service.id}>
                                            {service.tr_address1}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={style.rowField}>
                                <label>سرویس ترجمه فارسی</label>
                                <select
                                    name="transalte_fa"
                                    value={formData.transalte_fa}
                                    onChange={(e) => setFormData({ ...formData, transalte_fa: e.target.value })}
                                >
                                    <option value="" disabled hidden>
                                        لطفا یک گزینه انتخاب کنید
                                    </option>
                                    {farsiServices.map((service) => (
                                        <option key={service.id} value={service.id}>
                                            {service.tr_address1}
                                        </option>
                                    ))}
                                </select>
                            </div>
                           



                            {/* <div className={style.rowField}>
                                <label htmlFor="description">تاریخچه LLM</label>
                                <textarea
                                    name="description"
                                    rows="4"
                                    cols="40"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="LLM تاریخچه"
                                ></textarea>
                            </div> */}
                            <div className={style.rowField}>
                                <label htmlFor="language">زبان</label>
                                <select
                                    name="language"
                                    value={formData.language}
                                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                                    placeholder="زبان"
                                >
                                    <option value={"FA"}>
                                        فارسی
                                    </option>
                                    <option value={"EN"}>
                                        انگلیسی
                                    </option>
                                    <option value={"EN-FA"}>
                                        فارسی-انگلیسی
                                    </option>
                                </select>
                            </div>
                            <div className={style.rowField}>
                                <label htmlFor="language">استفاده از صف چین</label>
                                <select
                                    type="text"
                                    name="is_use_mq"
                                    value={formData.is_use_mq}
                                    onChange={(e) => setFormData({ ...formData, is_use_mq: e.target.value })}
                                    placeholder="LLM language"

                                >
                                    <option value={false}>غیرفعال</option>
                                    <option value={true}>فعال</option>
                                </select>
                            </div>
                            {selectedLlm && icondata && <>
                                <img src={`${API_BASE_URL}${icondata}`} width={180} />
                            </>}
                            <div className={style.rowField}>
                                <label htmlFor="icon">آیکون</label>
                                <input
                                    type="file"
                                    name="icon"
                                    onChange={(e) => setFormData({ ...formData, icon: e.target.files[0] })}
                                />
                            </div>

                            <div className={style.rowField}>
                                <button type="submit">{selectedLlm ? 'بروزرسانی مدل' : 'ایجاد مدل'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {modalDetail && (

                <div id="myModal" className={style.modal}>
                    <div className={style.modalcontent}>
                        <span className={style.close} onClick={() => {
                            setModalDetail(false);
                            setEv('1');
                        }}>
                            &times;
                        </span>
                        {ev === '1' && (
                            <>
                                <br />
                                <button className={style.darkBlueBtn} onClick={() => {
                                    setEv('2');
                                    setSelectedServer(null);
                                    setLlmServerData({
                                        name: '',
                                        url_address: '',
                                        url_address2: '',
                                        llm: '',
                                    });
                                }}>ایجاد سرور</button>
                            </>
                        )}

                        {ev === '2' && (
                            <>
                                <br />
                                <button className={style.darkBlueBtn} onClick={() => setEv('1')}>لیست سرورها</button>
                            </>
                        )}
                        {ev === '1' && (
                            <>
                                <br />
                                {llmList &&
                                    llmList.map((mp) => (
                                        <div key={mp.id} className={style.llmServerList}>
                                            <h4>{mp.name}</h4>
                                            <div className={style.llmServerListAddress}><span>آدرس شماره 1</span><span>{mp.url_address}</span></div>
                                            <div className={style.llmServerListAddress}><span>آدرس شماره 2</span><span>{mp.url_address2}</span></div>
                                            <div className={`${style.flexNormal} ${style.llmServerListBtns}`}>
                                                <button className={`${style.btn} ${style.lightBlueBtn}`}
                                                    onClick={() => handleServerEdit(mp)}>ویرایش
                                                </button>
                                                <button className={`${style.btn} ${style.lightRedBtn}`}
                                                    onClick={() => handleServerDelete(mp)}>حذف
                                                </button>
                                            </div>

                                        </div>
                                    ))}
                            </>
                        )}
                        {ev === '2' && (
                            <>
                                <br />
                                <h3>{selectedServer ? 'ویرایش سرور' : 'ایجاد سرور جدید'}</h3>
                                <form onSubmit={handleServerSubmit}>
                                    <div className={style.rowField}>
                                        <label htmlFor="name">نام سرور</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={llmServerData.name}
                                            onChange={(e) => setLlmServerData({ ...llmServerData, name: e.target.value })}
                                            placeholder="نام سرور"

                                        />
                                    </div>

                                    <div className={style.rowField}>
                                        <label htmlFor="url_address">آدرس URL</label>
                                        <input
                                            type="text"
                                            name="url_address"
                                            value={llmServerData.url_address}
                                            onChange={(e) => setLlmServerData({ ...llmServerData, url_address: e.target.value })}
                                            placeholder="آدرس URL سرور"

                                        />
                                    </div>

                                    <div className={style.rowField}>
                                        <label htmlFor="url_address2">آدرس ثانویه URL</label>
                                        <input
                                            type="text"
                                            name="url_address2"
                                            value={llmServerData.url_address2}
                                            onChange={(e) => setLlmServerData({ ...llmServerData, url_address2: e.target.value })}
                                            placeholder="آدرس ثانویه URL سرور"
                                        />
                                    </div>

                                    <div className={style.rowField}>
                                        <button type="submit">{selectedServer ? 'ویرایش سرور' : 'ایجاد سرور'}</button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}

            <div className={style.dataTableContainer}>
                <DataTable
                    className={style.khatamDataTable}
                    title={<h4>لیست مدل ها</h4>}
                    columns={columns}
                    data={llms}
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
        </div>
    );
};

export default CRUDLlmComponent;
