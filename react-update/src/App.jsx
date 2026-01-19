import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [Posts, setPosts] = useState([]);
  const [form, setForm] = useState({title: '', body: '', id: null});
  
  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/posts')
      .then(resp => setPosts(resp.data.slice(0, 10))) 
  }, []);

  const submit = e => {
    e.preventDefault(); 


    const url = form.id 
      ? `https://jsonplaceholder.typicode.com/posts/${form.id}` 
      : 'https://jsonplaceholder.typicode.com/posts'; 
    
    if (form.id) {

      axios.put(url, {title: form.title, body: form.body, userId: 1, id: form.id})
        .then(res => {

          setPosts(Posts.map(p => p.id === form.id ? res.data : p));
          setForm({title: '', body: '', id: null});
          console.log('Post updated:', res.data);
        })
        .catch(error => {
          console.error('Update error:', error);
        });
    } else {

      axios.post(url, {title: form.title, body: form.body, userId: 1})
        .then(res => {
        

          const newPost = {
            ...res.data,
            id: Posts.length > 0 ? Math.max(...Posts.map(p => p.id)) + 1 : 101
          };
          
          setPosts([newPost, ...Posts]); 
          setForm({title: '', body: '', id: null});
          console.log('New post created:', newPost);
        })
        .catch(error => {
          console.error('Create error:', error);
        });
    }
  };

  const deletePost = (id) => {
    axios.delete(`https://jsonplaceholder.typicode.com/posts/${id}`)
      .then(() => {
        setPosts(Posts.filter(p => p.id !== id));
        console.log('Post deleted:', id);
      })
      .catch(error => {
        console.error('Delete error:', error);
      });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Blog Posts ({Posts.length})</h1>
      
      <form onSubmit={submit} style={{ marginBottom: '30px' }}>
        <div style={{ marginBottom: '15px' }}>
          <input 
            type="text" 
            placeholder='Title' 
            value={form.title}
            onChange={e => setForm({...form, title: e.target.value})}
            style={{ width: '100%', padding: '10px', fontSize: '16px' }}
            required
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <textarea 
            name="post" 
            placeholder='Content' 
            value={form.body}
            onChange={e => setForm({...form, body: e.target.value})}
            style={{ width: '100%', padding: '10px', height: '100px', fontSize: '16px' }}
            required
          />
        </div>
        
        <button 
          type="submit"
          style={{ 
            padding: '10px 20px', 
            background: form.id ? '#4CAF50' : '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {form.id ? ' Update Post' : ' Create Post'}
        </button>
        
        {form.id && (
          <button 
            type="button" 
            onClick={() => setForm({title: '', body: '', id: null})}
            style={{ 
              marginLeft: '10px',
              padding: '10px 20px',
              background: '#f31e0f',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        )}
      </form>
      
      <div>
        <h2>All Posts:</h2>
        {Posts.map(p => (
          <div 
            key={p.id} 
            style={{ 
              border: '1px solid #ddd',
              padding: '15px',
              marginBottom: '10px',
              borderRadius: '5px',
              background: form.id === p.id ? '#e8f5e9' : 'white'
            }}
          >
            <h3 style={{ marginTop: '0' }}>
              {p.id} - {p.title}
              {form.id === p.id && (
                <span style={{ 
                  marginLeft: '10px',
                  background: '#4CAF50',
                  color: 'white',
                  padding: '3px 8px',
                  borderRadius: '3px',
                  fontSize: '12px'
                }}>
                  Editing...
                </span>
              )}
            </h3>
            <p>{p.body}</p>
            <div>
              <button 
                onClick={() => setForm(p)}
                style={{ 
                  marginRight: '10px',
                  padding: '5px 15px',
                  background: '#147a00',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                 Edit
              </button>
              <button 
                onClick={() => deletePost(p.id)}
                style={{ 
                  padding: '5px 15px',
                  background: '#aa0000',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                 Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;