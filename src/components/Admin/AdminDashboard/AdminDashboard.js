import style from './AdminDashboard.module.css'
import { IconUser } from "@/components/Icons/iconUser";
import { IconBot } from "@/components/Icons/iconBot";
import { IconChatBot } from "@/components/Icons/iconChatBot";
import { IconRequest } from "@/components/Icons/iconRequest";
import PieChart from "@/components/Charts/PieChart";
import LineChart from "@/components/Charts/LineChart";
import React, { useEffect, useState } from 'react';
import RamChart from "@/components/Charts/RamChart";
import CpuChart from "@/components/Charts/CpuChart";
import { IconCheck } from "@/components/icons2/iconCheck";
import { IconRefresh } from "@/components/icons2/iconRefresh";
import api from '@/utils/api'
const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ;

export default function AdminDashboard() {
    const [userData, setUserData] = useState(null);
    const [amar, setamar] = useState(null)
    const [llmdata, setllmdata] = useState(null)
    const [monthdata, setmonthdata] = useState(null)
    const [cpu, setcpu] = useState(null)
    const [ram, setram] = useState(null)
    const [llms, setllms] = useState(null)
    const [modalllm, setmodalllm] = useState(false)
    const [evllm,setevllm]= useState(0)
    const [evdata,setevdata] = useState(null)
    useEffect(() => {
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
            const parsedUserData = JSON.parse(storedUserData);
            setUserData(parsedUserData);
            api.get(`get_data_model/`).then(resp => {
                setamar(resp.data)
            }).catch(err => {
                console.log(err)
            })
            api.get(`get_data_llm/`).then(resp => {

                let llm = resp.data
                llm.forEach(item => {
                    if (item.llm__name == null) {
                        item.name = "Model"
                    } else {
                        item.name = item.llm__name
                    }
                    delete item.llm__name
                });
                setllmdata(llm)
            }).catch(err => {
                console.log(err)
            })

            api.get(`get_data_month_llm/`).then(resp => {
                setmonthdata(resp.data)
            }).catch(err => {
                console.log(err)
            })
            api.get(`get_data_cpu/`).then(resp => {
                setcpu(resp.data.CPU)
            }).catch(err => {
                console.log(err)
            })
            api.get(`get_data_ram/`).then(resp => {
                setram(resp.data.RAM)
            }).catch(err => {
                console.log(err)
            })

            fechllm()
        }

    }, []);

    const fechllm = async () => {
        const resp = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/llmservers/`, {
            headers: {
                Authorization: "Amin_4545",
                'Content-Type': 'application/json',
            },
        });
        const dataresp = await resp.json();
        setllms(dataresp)
    }
    const detailllm = (data)=>{
        setevdata(data)
        setevllm(1)
    }
    return (
        <div className={style.dashboard}>
            {modalllm && <div id="myModal" className={style.modal}>

                <div className={style.modalcontent}>
                    <span className={style.close} onClick={() => setmodalllm(false)}>&times;</span>
                    <br />
                    {evllm == 1 ? <div>
                        <button onClick={()=>setevllm(0)} className={`${style.lightBlueBtn} ${style.btn}`}>نمایش لیست مدل ها</button>
                    </div> : <div>
                        <h3>لیست مدل ها</h3>
                        </div>}
                    <br />
                    <hr /> 
                    {evllm == 0 ? 
                    <div style={{ display: "flex", flexWrap: "wrap" }}>
                        {llms.map(mp => <center key={mp.id} style={{ padding: "10px",margin:"3px 3px 3px" }}>
                        <p> مدل {mp.name}</p>
                        <br />  
                            <img src={`${API_BASE_URL}${mp.icon}`} width={70} height={60} />
                        <br />
                        <p>وضعیت : {mp.status ?  <b style={{color:"green"}}>فعال</b> : <b style={{color:"red"}}>غیرفعال</b>}</p>
                        <br />
                        <button onClick={()=>detailllm(mp)} style={{color:"white"}} className={`${style.lightBlueBtn} ${style.btn}`}>نمایش اطلاعات</button>
                        </center>)}
                    </div>
                    : ""}
                    {evdata && evllm == 1 ? <div>
                        <br />
                        <img src={`${API_BASE_URL}${evdata.icon}`} width={90} />
                        <br />
                        <br />
                        <p>نام مدل : {evdata.name}</p>
                        <br />
                        <p>درباره مدل : {evdata.description}</p>
                        <br />
                        <p> زبان ورودی :  {evdata.language}</p>
                        <br />
                        <p>  نسخه :  {evdata.version}</p>
                        <br />
                        <p> استفاده از صف چین :  {evdata.is_use_mq ? "فعال" : "غیرفعال "}</p>
                        <br />
                        <p>وضعیت : {evdata.status ?  <b style={{color:"green"}}>فعال</b> : <b style={{color:"red"}}>غیرفعال</b>}</p>


                    </div>: ""}
                </div>
            </div>}
            {amar &&
                <div className={`${style.row} ${style.flexSpace}`}>
                    <div className={`${style.clm25} ${style.stat}`}>
                        <div className={style.flexSpace}>
                            <span>تعداد کاربران</span>
                            <IconUser color={"#ffffff"} size={"24px"} />
                        </div>
                        <div className={style.separator}></div>
                        <div className={`${style.flexSpace} ${style.statValue}`}>
                            <span>{amar.users}</span>
                        </div>
                    </div>
                    <div className={`${style.clm25} ${style.stat}`}>
                        <div className={style.flexSpace}>
                            <span>تعداد چت ها</span>
                            <IconChatBot color={"#ffffff"} size={"24px"} />
                        </div>
                        <div className={style.separator}></div>
                        <div className={`${style.flexSpace} ${style.statValue}`}>
                            <span>{amar.chats}</span>
                        </div>
                    </div>
                    <div className={`${style.clm25} ${style.stat}`}>
                        <div className={style.flexSpace}>
                            <span>تعداد مدل ها</span>
                            <IconBot color={"#ffffff"} size={"24px"} />
                            {llms &&                             <button onClick={() => setmodalllm(true)} className={`${style.lightBlueBtn} ${style.btn}`}>      نمایش وضعیت </button>
                        }
                        </div>
                        <div className={style.separator}></div>
                        <div className={`${style.flexSpace} ${style.statValue}`}>
                            <span>{amar.llm}</span>
                        </div>
                    </div>
                    <div className={`${style.clm25} ${style.stat}`}>
                        <div className={style.flexSpace}>
                            <span>تعداد سشن ها</span>
                            <IconRequest color={"#ffffff"} size={"24px"} />
                        </div>
                        <div className={style.separator}></div>
                        <div className={`${style.flexSpace} ${style.statValue}`}>
                            <span>{amar.Session}</span>
                        </div>
                    </div>
                </div>}
            <div className={`${style.row} ${style.flexSpace}`}>
                {llmdata && <div className={`${style.clm} ${style.clm30}`}>
                    <div className={style.clmHeader}>
                        <h3>میزان استفاده از مدل ها</h3>
                    </div>
                    <PieChart data={llmdata} />
                </div>}
                {monthdata && <div className={`${style.clm} ${style.clm70}`}>
                    <div className={style.clmHeader}>
                        <h3>میزان ترافیک مصرف شده توسط مدل ها</h3>
                    </div>
                    <LineChart data={monthdata} />
                </div>}
            </div>

            <div>
            </div>
        </div>
    )
}