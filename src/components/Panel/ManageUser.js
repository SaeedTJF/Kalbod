
import React, { useEffect, useState } from 'react';
import api from '@/utils/api'
import DataTable from 'react-data-table-component';
import style from './Manage.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const API_BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}`

const CRUDUserComponent = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [modal, setModal] = useState(false);
    const [filterText, setFilterText] = useState('');
    const [next, setnext] = useState(null)
    const [prev, setprev] = useState(null)
    const [modaldelete, setmodaldelete] = useState(false)
    const [countpage, setcountpage] = useState(false)
    const [selectrow, setselectrow] = useState(null)
    const [clearselect,setclearselect] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        name: '',
        family: '',
        pod_id: '',
        image: '',
        token: ''
    });

    useEffect(() => {
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
            const parsedUserData = JSON.parse(storedUserData);
            setUserData(parsedUserData);
        }
    }, []);

    // Fetch all users (Read - List)
    const fetchUsers = async () => {
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
            const parsedUserData = JSON.parse(storedUserData);
            const response = await api.get(`users/`);
            setUsers(response.data.results);
            setFilteredUsers(response.data.results);
            setnext(response.data.next)
            setprev(response.data.previous)
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Filter users based on the filter text
    useEffect(() => {
        const filtered = users.filter(
            user =>
                user.name.toLowerCase().includes(filterText.toLowerCase()) ||
                user.family.toLowerCase().includes(filterText.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [filterText, users]);

    // Create or Update user
    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            if (selectedUser) {
                // Update user (Update)
                await api.put(`users/${selectedUser.id}/`, formData, {
                    headers: {
                        Authorization: userData.token,
                        'Content-Type': 'application/json',
                    }
                });
                toast.success('با موفقیت بروزرسانی شد');
            } else {
                // Create new user (Create)
                await api.post(`users/`, formData, {
                    headers: {
                        Authorization: userData.token,
                        'Content-Type': 'application/json',
                    }
                });
                toast.success('با موفقیت ساخته شد');
            }
            fetchUsers();
            setSelectedUser(null);
            setFormData({
                email: '',
                username: '',
                name: '',
                family: '',
                pod_id: '',
                image: '',
                token: ''
            });
            setModal(false);
        } catch (error) {
            toast.error('عملیات با شکست مواجه شد');
            console.error('There was an error!', error);
        }
    };

    // Delete user
    const handleDelete = async (id) => {
        try {
            await api.delete(`users/${id}/`, {
                headers: {
                    Authorization: userData.token,
                    'Content-Type': 'application/json',
                }
            });
            toast.error('با  موفقیت حذف شد');
            setmodaldelete(false)
            fetchUsers();
        } catch (error) {
            toast.error('عملیات با شکست مواجه شد');
            console.error('There was an error!', error);
        }
    };

    // Edit user (Load user data into form for editing)
    const handleEdit = (user) => {
        setModal(true);
        setSelectedUser(user);
        setFormData({
            email: user.email,
            username: user.username,
            name: user.name,
            family: user.family,
            pod_id: user.pod_id,
            image: user.image,
            token: user.token
        });
    };

    const columns = [
        { name: <h3>ایمیل</h3>, selector: row => row.email, sortable: true },
        { name: <h3>نام کاربری</h3>, selector: row => row.username, sortable: true },
        { name: <h3>نام</h3>, selector: row => row.name, sortable: true },
        { name: <h3>نام خانوادگی</h3>, selector: row => row.family, sortable: true },
        {
            name: <h3>عملیات</h3>, cell: row => (
                <>
                    <button className={`${style.btn} ${style.lightBlueBtn}`} onClick={() => handleEdit(row)}>ویرایش</button>
                    <button className={`${style.btn} ${style.lightRedBtn}`} onClick={() => setmodaldelete(row.id)}>حذف</button>
                </>
            )
        }
    ];

    const closeModal = () => {
        setModal(false);
        setSelectedUser(null);
        setFormData({
            email: '',
            username: '',
            name: '',
            family: '',
            pod_id: '',
            image: '',
            token: ''
        });
    };
    const fetchpage = async (url) => {
        try {
            const storedUserData = localStorage.getItem('userData');
            if (storedUserData) {
                let xurl = url.split('?')

                let urlparams = new URLSearchParams(xurl[1])
                setcountpage(urlparams.get('page'))
                const parsedUserData = JSON.parse(storedUserData);
                const response = await api.get(`${url}`);
                setUsers(response.data.results);
                setFilteredUsers(response.data.results);
                setnext(response.data.next)
                setprev(response.data.previous)
            }
        } catch (error) {
            toast.error('عملیات با شکست مواجه شد');
            console.error('There was an error!', error);
        }
    }

    const searchuser = async (e) => {
        try {
            let q = e.target.value

            const storedUserData = localStorage.getItem('userData');
            if (storedUserData) {
                const parsedUserData = JSON.parse(storedUserData);
                // console.log("Loaded User Data from localStorage:", parsedUserData);

                const response = await api.get(`search-users/?q=${q}`);
                setUsers(response.data.results);
                setFilteredUsers(response.data.results);
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
        api.post(`delete-users/`, josndata).then(resp => {
            setselectrow(null)
            fetchUsers()
            toast.success('عملیات مورد نظر با موفقیت انجام شد')
        }).catch(err => {
            console.log(err)
            toast.error('عملیات با شکست مواجه شد');
        })
    }

    const paginationOptions = {
        rowsPerPageText: 'Rows per page:',
        rangeSeparatorText: 'of',
        noRowsPerPage: false,
        selectAllRowsItem: false,
        selectAllRowsItemText: '',

    }

    const handlecleartable = ()=>{
            setselectrow(null)
        setclearselect(!clearselect)

    }
    return (
        <div>
            <ToastContainer />
            {
                modaldelete && <div id="myModal" className={style.modal}>

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
                </div>
            }
            <div className={style.rowField}>
                <button className={style.createBtn} onClick={() => setModal(true)}>افزون کاربر جدید</button>

                {/* <input
                type="text"
                placeholder="فیلتر بر اساس نام یا نام خانوادگی..."
                value={filterText}
                onChange={e => setFilterText(e.target.value)}
                className={style.userFilterInput}
            /> */}

                <input type='text' placeholder='نام نام خانوادگی یا ایمیل کاربر مورد نظر را وارد کنید' id='quser' onChange={(e) => searchuser(e)} />
                <button className={`${style.btn} ${style.lightBlueBtn}`} onClick={() => {
                    fetchUsers()
                    document.getElementById('quser').value = ""
                }}>
                    بازنشانی فیلتر
                </button>
                {selectrow && <>
                    <button className={`${style.btn} ${style.lightRedBtn}`} onClick={() => deleteselect()}> حذف موارد انتخاب شده </button>
                    <button className={`${style.btn} ${style.lightBlueBtn}`} onClick={() => handlecleartable()}> لغو   </button>

                    

                </>}
            </div>
            {
                modal && (
                    <div id="myModal" className={style.modal}>
                        <div className={style.modalcontent}>
                            <span className={style.close} onClick={() => closeModal()}>&times;</span>
                            <br />
                            <form onSubmit={handleSubmit}>
                                <div className={style.rowField}>
                                    <label htmlFor="email">ایمیل</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="ایمیل"

                                    />
                                </div>

                                <div className={style.rowField}>
                                    <label htmlFor="username">شناسه کاربری</label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={e => setFormData({ ...formData, username: e.target.value })}
                                        placeholder="شناسه کاربری"

                                    />
                                </div>

                                <div className={style.rowField}>
                                    <label htmlFor="name">نام</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="نام"

                                    />
                                </div>

                                <div className={style.rowField}>
                                    <label htmlFor="family">نام خانوادگی</label>
                                    <input
                                        type="text"
                                        name="family"
                                        value={formData.family}
                                        onChange={e => setFormData({ ...formData, family: e.target.value })}
                                        placeholder="نام خانوادگی"

                                    />
                                </div>

                                <div className={style.rowField}>
                                    <label htmlFor="pod_id">شناسه پاد</label>
                                    <input
                                        type="text"
                                        name="pod_id"
                                        value={formData.pod_id}
                                        onChange={e => setFormData({ ...formData, pod_id: e.target.value })}
                                        placeholder="شناسه پاد"

                                    />
                                </div>

                                <div className={style.rowField}>
                                    <label htmlFor="image">آواتار</label>
                                    <input
                                        type="text"
                                        name="image"
                                        value={formData.image}
                                        onChange={e => setFormData({ ...formData, image: e.target.value })}
                                        placeholder="تصویر کاربر"
                                    />
                                </div>

                                <div className={style.rowField}>
                                    <label htmlFor="token">توکن</label>
                                    <input
                                        type="text"
                                        name="token"
                                        value={formData.token}
                                        onChange={e => setFormData({ ...formData, token: e.target.value })}
                                        placeholder="توکن"

                                    />
                                </div>

                                <div className={style.rowField}>
                                    <button type="submit">{selectedUser ? 'بروزرسانی کاربر' : 'ایجاد کاربر'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            <div className={style.dataTableContainer}>
                <DataTable
                    className={style.khatamDataTable}
                    title={<h4>لیست کاربران</h4>}
                    columns={columns}
                    data={filteredUsers}
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
        </div >
    );
};

export default CRUDUserComponent;
