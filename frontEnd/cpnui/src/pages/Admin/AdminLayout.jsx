import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faUser, faSignOutAlt, faCog, faUsers, faEnvelope, faFileAlt, faCalendarAlt, faPlus, faList, faUserGraduate } from '@fortawesome/free-solid-svg-icons';

const sidebarLinks = [
  { id: 'dashboard', label: 'Dashboard', icon: faFileAlt },
  { id: 'profile', label: 'Profile', icon: faUser },
  { id: 'subscribers', label: 'Subscribers', icon: faUsers },
  { id: 'newsletter', label: 'Newsletter', icon: faList },
  { id: 'enrollees', label: 'Enrollee Management', icon: faUserGraduate },
  { id: 'blog-create', label: 'Create Blog Post', icon: faPlus },
  { id: 'blog-list', label: 'Blog Posts', icon: faFileAlt },
  { id: 'inquiries', label: 'Contact Inquiries', icon: faEnvelope },
  { id: 'admin-management', label: 'Admin Management', icon: faCog },
  { id: 'events', label: 'Events', icon: faCalendarAlt },
  { id: 'create-event', label: 'Create Event', icon: faPlus },
  { id: 'event-registrations', label: 'Event Registrations', icon: faFileAlt },
];

const AdminLayout = ({ admin, onLogout, activeSection, setActiveSection, onShowChangePassword, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className={`fixed z-30 inset-y-0 left-0 w-64 bg-gray-900 text-white transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-200 ease-in-out flex flex-col`}>
        <div className="flex flex-col items-center pt-12 pb-8 border-b border-gray-800">
          <img
            src={admin?.profilePic || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(admin?.username || 'Admin') + '&background=111827&color=fff&size=128'}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border-4 border-amber-500 mb-3 shadow-lg"
          />
          <h2 className="text-base font-semibold leading-tight truncate max-w-[90%] text-center">{admin?.username || 'Admin'}</h2>
          <p className="text-xs text-gray-400 truncate max-w-[90%] text-center">{admin?.email}</p>
        </div>
        <nav className="flex-1 mt-6">
          {sidebarLinks
            .filter(link => link.id !== 'admin-management' || admin?.role === 'superadmin')
            .map(link => (
              <button
                key={link.id}
                onClick={() => { setActiveSection(link.id); setSidebarOpen(false); }}
                className={`w-full flex items-center px-6 py-3 text-left text-sm font-medium transition-colors duration-150 ${activeSection === link.id ? 'bg-amber-600 text-white' : 'hover:bg-gray-800 hover:text-amber-400'}`}
              >
                <FontAwesomeIcon icon={link.icon} className="mr-3 text-base" />
                {link.label}
              </button>
            ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen md:ml-64">
        {/* Top Navbar */}
        <header className="flex items-center justify-between bg-white shadow px-4 py-3 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-gray-700 focus:outline-none"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <FontAwesomeIcon icon={faBars} className="text-2xl" />
            </button>
            <span className="font-bold text-lg text-gray-900">Admin Dashboard</span>
          </div>
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center gap-2 focus:outline-none"
              onClick={() => setDropdownOpen((open) => !open)}
            >
              <img
                src={admin?.profilePic || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(admin?.username || 'Admin') + '&background=111827&color=fff&size=64'}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-amber-500"
              />
              <span className="font-semibold text-gray-900 hidden sm:block">{admin?.username || 'Admin'}</span>
              <FontAwesomeIcon icon={faTimes} className="text-gray-500" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <button
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => { setActiveSection('profile'); setDropdownOpen(false); }}
                >
                  <FontAwesomeIcon icon={faUser} className="mr-2" />
                  View/Edit Profile
                </button>
                <button
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => { onShowChangePassword(); setDropdownOpen(false); }}
                >
                  <FontAwesomeIcon icon={faTimes} className="mr-2" />
                  Change Password
                </button>
                <button
                  className="w-full flex items-center px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                  onClick={onLogout}
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>
        <main className="flex-1 p-2 sm:p-4 md:p-8 bg-gray-100 min-h-[calc(100vh-64px)] w-full">{children}</main>
      </div>
    </div>
  );
};

AdminLayout.propTypes = {
  admin: PropTypes.shape({
    username: PropTypes.string,
    email: PropTypes.string,
    profilePic: PropTypes.string
  }).isRequired,
  onLogout: PropTypes.func.isRequired,
  activeSection: PropTypes.string.isRequired,
  setActiveSection: PropTypes.func.isRequired,
  onShowChangePassword: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired
};

export default AdminLayout; 