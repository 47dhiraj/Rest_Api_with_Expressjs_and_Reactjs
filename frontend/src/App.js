import {
  BrowserRouter as Router,            
  Routes,                             
  Route,                             

} from 'react-router-dom'


import Layout from './components/Layout';
import Register from './components/Register';
import Login from './components/Login';
import LinkPage from './components/LinkPage';
import Unauthorized from './components/Unauthorized';

import Home from './components/Home';
import Admin from './components/Admin';
import Missing from './components/Missing';
import RequireAuth from './components/RequireAuth';

import PersistLogin from './components/PersistLogin';


const ROLES = {
  'Admin': 5846,
  'Editor': 1999,
  'User': 1996
}




function App() {

  return (

    <Routes>

      <Route path="/" element={<Layout />}>            

        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="linkpage" element={<LinkPage />} />
        <Route path="unauthorized" element={<Unauthorized />} />


        <Route element={<PersistLogin />}>

          <Route element={<RequireAuth allowedRoles={[ROLES.User, ROLES.Admin]} />}>
            <Route path="/" element={<Home />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
            <Route path="admin" element={<Admin />} />
          </Route>

        </Route>


        <Route path="*" element={<Missing />} />


      </Route>

    </Routes>

  );

}


export default App;
