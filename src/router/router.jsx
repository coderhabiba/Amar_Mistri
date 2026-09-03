import { createBrowserRouter } from 'react-router';
import App from '../App';
import JoinAsMistri from '../pages/JoinAsMistri/JoinAsMistri';
import BookNow from '../pages/BookNow/BookNow';
import Home from '../pages/Home/Home';
import TermsAndConditions from '../pages/Terms/Terms&Conditions';
import ErrorPage from '../pages/ErrorPage/ErrorPage';
import PrivacyPolicy from '../pages/PrivacyPolicy/PrivacyPolicy';
import AboutUs from '../pages/AboutUs/AboutUs';
import ContactUs from '../pages/Contact/Contact';
import UserHelpline from '../pages/UserHelpline/UserHelpline';
import MechanicHelpline from '../pages/MechanicHelpline/MechanicHelpline';
import SupportCenter from './../pages/SupportCenter/SupportCenter';
import WorkInSupport from './../pages/WorkInSupport/WorkInSupport';
import HowToJoinMechanic from '../pages/HowToJoinMechanic/HowToJoinMechanic';
import Blog from '../pages/Blog/Blog';
import MistryList from './../pages/MistryList/MistryList';
import MistryMap from '../pages/MistryMap/MistryMap';
import Services from '../pages/Services/Services';
import CategoryMechanics from '../pages/CategoryMechanics/CategoryMechanics';
import ServiceDetails from './../pages/ServicesDetails/ServicesDetails';
import MistriReviews from '../pages/MistriReviews/MistriReviews';
import Login from '../pages/Login/Login';
import MistriDashboard from '../components/Dashboard/MistriDashboard';
import AdminDashboard from '../components/Dashboard/AdminDashboard';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import Overview from './../components/Dashboard/mistri/Overview';
import Profile from './../components/Dashboard/mistri/Profile';
import Jobs from './../components/Dashboard/mistri/Jobs';
import WorkGallery from './../components/Dashboard/mistri/WorkGallery';
import CertificatesHub from './../components/Dashboard/mistri/CertificatesHub';
import Earnings from './../components/Dashboard/mistri/Earnings';
import Settings from './../components/Dashboard/mistri/Settings';

const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: 'join-mistry',
        Component: JoinAsMistri,
      },
      {
        path: 'login',
        Component: Login,
      },
      {
        path: 'book-now',
        Component: BookNow,
      },
      {
        path: 'mistries',
        Component: MistryList,
      },
      {
        path: 'map',
        Component: MistryMap,
      },
      {
        path: 'how-to-join-mechanic',
        Component: HowToJoinMechanic,
      },
      {
        path: 'terms-conditions',
        Component: TermsAndConditions,
      },
      {
        path: 'privacy-policy',
        Component: PrivacyPolicy,
      },
      {
        path: 'about-us',
        Component: AboutUs,
      },
      {
        path: 'contact',
        Component: ContactUs,
      },
      {
        path: 'user-helpline',
        Component: UserHelpline,
      },
      {
        path: 'mechanic-helpline',
        Component: MechanicHelpline,
      },
      {
        path: 'support-center',
        Component: SupportCenter,
      },
      {
        path: 'work-in-support-center',
        Component: WorkInSupport,
      },
      {
        path: 'blog',
        Component: Blog,
      },
      {
        path: 'services',
        Component: Services,
      },
      {
        path: 'services/:categoryKey',
        Component: ServiceDetails,
      },
      {
        path: 'services/sub/:categoryId',
        Component: CategoryMechanics,
      },
      {
        path: 'reviews/:mistriId',
        Component: MistriReviews,
      },
      {
        path: '*',
        Component: ErrorPage,
      },

      {
        path: '/dashboard',
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: 'admin',
            Component: AdminDashboard,
          },
          {
            path: 'mistri',
            Component: MistriDashboard,
          },
          {
            path: 'mistri',
            Component: Overview,
          },
          {
            path: 'admin',
            Component: Overview,
          },
          {
            path: 'profile',
            Component: Profile,
          },
          {
            path: 'jobs',
            Component: Jobs,
          },
          {
            path: 'gallery',
            Component: WorkGallery,
          },
          {
            path: 'certificates',
            Component: CertificatesHub,
          },
          {
            path: 'earnings',
            Component: Earnings,
          },
          {
            path: 'settings',
            Component: Settings,
          },
        ],
      },
    ],
  },
  {},
]);

export default router;
