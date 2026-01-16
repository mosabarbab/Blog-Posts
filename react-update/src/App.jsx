import './App.css';
import { useState,useEffect } from 'react';
import axios from 'axios';

function App() {
  const [Posts,setPosts]=useState([])
  const [form,setForm]=useState({title:'',body:'',id:null});
    useEffect(()=>{
      axios.get('https://jsonplaceholder.typicode.com/posts')
      .then(resp=>setPosts(resp.data))
    },[]);

    const submit =e=>{
      e.preventDefault()
      const url =`https://jsonplaceholder.typicode.com/posts/${form.id || ''}`
      const req = form.id ? axios.put : axios.post;
      req(url,{title:form.title,body:form.body,userId:1})
      .then(res=>{
        setPosts(form.id ? Posts.map(p=> p.id===form.id ? res.data : p):[...Posts,res.date])
        setForm({title: '', body: '', id: null})
      })
    }


  return (
    <>
    <div>
      <form onSubmit={submit}>
        <input type="text" placeholder='Title' value={form.title}
        
        onChange={e=>setForm({...form,title:e.target.value})} />
        <textarea name="post" placeholder='post' value={form.body}
        
        onChange={e=>setForm({...form,body:e.target.value})} />

        <button>{form.id ? 'update':'post'}</button>

        {
          Posts.map(p=>(
            <div key={p.id}>
                <h1>{p.title}</h1>
                <button onClick={()=>setForm(p)}>Edit</button>
            </div>
          ))
        }
      </form>
         



    </div>





    </>
  );
}

export default App
