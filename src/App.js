import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import BusinessDetail from './pages/BusinessDetail';
import AddBusiness from './pages/AddBusiness';
import Checkout from './pages/Checkout';
import AddItem from './pages/AddItem';
import OwnerOrders from './pages/OwnerOrders';
import MyOrders from './pages/MyOrders';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/business/:id" element={<BusinessDetail />} />
        <Route path="/add-business" element={<AddBusiness />} />
        <Route path="/checkout/:id" element={<Checkout />} />
        <Route path="/add-item/:businessId" element={<AddItem />} />
        <Route path="/orders/:businessId" element={<OwnerOrders />} />
        <Route path="/my-orders" element={<MyOrders />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;