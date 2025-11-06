import React, {useState} from 'react';
import axios from 'axios';
export default function Admin(){
  const [name,setName] = useState(''); const [src,setSrc] = useState(''); const [type,setType] = useState('geeksforgeeks');
  const [msg,setMsg] = useState('');
  const add = async()=>{
    try{
      await axios.post('http://localhost:5000/api/admin/add_company',{name, source: src, source_type: type});
      setMsg('Company added, reload dashboard.');
    }catch(e){ setMsg('Error'); }
  }
  return (<div className='container py-4'>
    <h2>Admin</h2>
    <div className='mb-2'><input className='form-control' placeholder='Company name' value={name} onChange={e=>setName(e.target.value)} /></div>
    <div className='mb-2'><input className='form-control' placeholder='Source URL' value={src} onChange={e=>setSrc(e.target.value)} /></div>
    <div className='mb-2'>
      <select className='form-select' value={type} onChange={e=>setType(e.target.value)}>
        <option value='geeksforgeeks'>GeeksforGeeks</option>
        <option value='leetcode'>LeetCode</option>
        <option value='glassdoor'>Glassdoor</option>
      </select>
    </div>
    <div><button className='btn btn-success' onClick={add}>Add Company</button></div>
    <p className='mt-3 text-success'>{msg}</p>
  </div>);
}
