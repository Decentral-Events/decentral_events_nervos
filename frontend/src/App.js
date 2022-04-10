import { Component } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ethers } from 'ethers';
import './App.css';
import { AuthContext } from './context';
import EventPlannerContract from './abi/EventPlanner.json';
import Footer from './components/Footer';
import Header from './components/Header';
import Navbar from './components/Navbar';
import OnlyAuthorized from './components/OnlyAuthorized';
import OnlyAdmin from './components/OnlyAdmin';
import HomePage from './pages/HomePage/HomePage';
import EventListPage from './pages/EventListPage';
import EventDetailPage from './pages/EventDetailPage';
import Dashboard from './pages/admin/Dashboard/Dashboard';
import RegisterPage from './pages/RegisterPage';
import CategoriesPage from './pages/CategoriesPage';
import ContactPage from './pages/ContactPage';
import ReservationPage from './pages/ReservationPage/ReservationPage';
import CreateEvent from './pages/admin/CreateEvent/CreateEvent';
import DraftEvents from './pages/admin/DraftEvents';
import EditEvent from './pages/admin/EditEvent';
import TestTokenPage from './pages/TestTokenPage';
import SwtichNetworkButton from './components/SwitchNetworkButton';
import MetamaskErrorPage from './pages/MetamaskErrorPage';


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      provider: null,
      isLoggedIn: false,
      user: {
        name: "",
        address: "",
        image: "",
        username: ""
      },
      token: "",
      expireTimeStamp: 0,
      signer: null
    };
  }

  async componentDidMount() {
    if (!window.ethereum) {
      this.setState({ error: "Please Install/Update MetaMask" });
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    try {
      if (localStorage.getItem("auth")) {
        const {
          user,
          token,
          isLoggedIn,
          expireTimeStamp
        } = JSON.parse(localStorage.getItem("auth"));
        if (user.address === address)
          this.setState({
            user,
            signer,
            token,
            isLoggedIn,
            expireTimeStamp
          });
      }
    } catch (err) {
      localStorage.removeItem("auth");
    }

    this.setState({ provider });

    // reload on network change
    provider.on("network", (newNetwork, oldNetwork) => {
      if (oldNetwork) {
        window.location.reload();
      }
    });
    console.log((await provider.getNetwork()).chainId)
    if ((await provider.getNetwork()).chainId !== EventPlannerContract.chainId) {
      this.setState({ error: `Please connect to Polygon Network` });
      return;
    }
    // reload if logged in and account changed 
    window.ethereum.on("accountsChanged", (account) => {
      if (this.state.isLoggedIn)
        window.location.reload();
    })
  }

  render() {
    const { error, provider, isLoggedIn, user, token, expireTimeStamp, signer } = this.state;
    if (error)
      return <MetamaskErrorPage error={error} />;

    if (!provider)
      return <>Loading...</>;
    return (
      <Router>
        <AuthContext.Provider value={{
          isLoggedIn,
          user,
          token,
          expireTimeStamp,
          signer,
          setUser: (user) => { this.setState({ user }) },
          setToken: (token) => { this.setState({ token }) },
          setExpireTimeStamp: (expireTimeStamp) => { this.setState({ expireTimeStamp }) },
          setIsLoggedIn: (isLoggedIn) => { this.setState({ isLoggedIn }) },
          setSigner: (signer) => { this.setState({ signer }) },
          setLoginData: ({ user, isLoggedIn, signer, token, expireTimeStamp }) => { this.setState({ user, isLoggedIn, signer, token, expireTimeStamp }) }
        }}>
          <Header provider={provider} />
          <Navbar />
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/events' element={<EventListPage />} />
            <Route path='/categories' element={<CategoriesPage />} />
            <Route path='/events/:id' element={<EventDetailPage />} />
            <Route path='/contact' element={<ContactPage />} />
            <Route path='/admin' element={<OnlyAdmin><Dashboard /></OnlyAdmin>} />
            <Route path='/admin/create' element={<OnlyAdmin><CreateEvent /></OnlyAdmin>} />
            <Route path='/admin/create/:id' element={<OnlyAdmin><CreateEvent /></OnlyAdmin>} />
            <Route path='/admin/edit/:id' element={<OnlyAdmin><EditEvent /></OnlyAdmin>} />
            <Route path='/admin/draft' element={<OnlyAdmin><DraftEvents /></OnlyAdmin>} />
            <Route path='/reservations' element={<OnlyAuthorized><ReservationPage /></OnlyAuthorized>} />
            <Route path='/register' element={<RegisterPage provider={provider} />} />
            <Route path='/tokens' element={<TestTokenPage />} />
          </Routes>
          <Footer />
        </AuthContext.Provider>
      </Router>
    );
  }
}
