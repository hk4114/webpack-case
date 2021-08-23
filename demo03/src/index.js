import axios from 'axios';

axios.get('/api/info.json').then(res => {
  console.log(res, 'sign')
})