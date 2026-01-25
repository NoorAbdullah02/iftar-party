import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, LayoutDashboard, Home, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { logoutUser } from '../Services/authApi.js';

const Header = () => {
    const { isLoggedIn, logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logoutUser();
            logout();
            toast.success('লগআউট সফল হয়েছে');
            navigate('/login');
            setMobileMenuOpen(false);
        } catch (err) {
            console.error('Logout error:', err);
            toast.error('লগআউট ব্যর্থ হয়েছে');
        }
    };

    const isActive = (path) => location.pathname === path;

    return (
        <header className="sticky top-0 z-50 bg-green-800 shadow-xl border-b-4 border-green-600">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-20">
                    {/* Logo/Brand */}
                    <Link
                        to="/"
                        className="flex items-center gap-3 group"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300 border-4 border-green-200">
                            <span className="text-3xl">🌸</span>
                        </div>
                        <div className="hidden md:block">
                            <h1 className="text-2xl font-bold text-white leading-tight drop-shadow-md">
                                চড়ুইভাতি – ২০২৬
                            </h1>
                            <p className="text-sm text-green-100 font-medium">ICE Department</p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-3">
                        <Link
                            to="/"
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all duration-300 ${isActive('/')
                                ? 'bg-white text-green-800 shadow-xl'
                                : 'text-white hover:bg-green-700'
                                }`}
                        >
                            <Home className="w-5 h-5" />
                            হোম
                        </Link>

                        {!isLoggedIn && (
                            <Link
                                to="/picnic-register"
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all duration-300 ${isActive('/picnic-register')
                                    ? 'bg-white text-green-800 shadow-xl'
                                    : 'bg-green-700 text-white hover:bg-green-600 border border-green-500'
                                    }`}
                            >
                                <span className="text-xl">📝</span>
                                রেজিস্ট্রেশন
                            </Link>
                        )}

                        {isLoggedIn ? (
                            <>
                                <Link
                                    to="/admin-dashboard"
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all duration-300 ${isActive('/admin-dashboard')
                                        ? 'bg-white text-green-800 shadow-xl'
                                        : 'text-white hover:bg-green-700'
                                        }`}
                                >
                                    <LayoutDashboard className="w-5 h-5" />
                                    ড্যাশবোর্ড
                                </Link>
                                <Link
                                    to="/profile"
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all duration-300 ${isActive('/profile')
                                        ? 'bg-white text-green-800 shadow-xl'
                                        : 'text-white hover:bg-green-700'
                                        }`}
                                >
                                    <User className="w-5 h-5" />
                                    {user?.name || 'প্রোফাইল'}
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all duration-300 shadow-lg"
                                >
                                    <LogOut className="w-5 h-5" />
                                    লগআউট
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="h-8 w-0.5 bg-green-600 mx-2"></div>
                                <Link
                                    to="/login"
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all duration-300 ${isActive('/login')
                                        ? 'bg-white text-green-800 shadow-xl'
                                        : 'text-green-100 hover:text-white hover:bg-green-700'
                                        }`}
                                >
                                    <User className="w-5 h-5" />
                                    অ্যাডমিন
                                </Link>
                            </>
                        )}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-3 text-white hover:bg-green-700 rounded-xl transition-colors"
                    >
                        {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t-2 border-green-600">
                        <nav className="flex flex-col gap-2">
                            <Link
                                to="/"
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold transition-all duration-300 ${isActive('/')
                                    ? 'bg-white text-green-800 shadow-lg'
                                    : 'text-white hover:bg-green-700'
                                    }`}
                            >
                                <Home className="w-5 h-5" />
                                হোম
                            </Link>

                            {!isLoggedIn && (
                                <Link
                                    to="/picnic-register"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold transition-all duration-300 ${isActive('/picnic-register')
                                        ? 'bg-white text-green-800 shadow-lg'
                                        : 'bg-green-700 text-white hover:bg-green-600 border border-green-500'
                                        }`}
                                >
                                    <span className="text-xl">📝</span>
                                    রেজিস্ট্রেশন
                                </Link>
                            )}

                            {isLoggedIn ? (
                                <>
                                    <Link
                                        to="/admin-dashboard"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold transition-all duration-300 ${isActive('/admin-dashboard')
                                            ? 'bg-white text-green-800 shadow-lg'
                                            : 'text-white hover:bg-green-700'
                                            }`}
                                    >
                                        <LayoutDashboard className="w-5 h-5" />
                                        ড্যাশবোর্ড
                                    </Link>
                                    <Link
                                        to="/profile"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold transition-all duration-300 ${isActive('/profile')
                                            ? 'bg-white text-green-800 shadow-lg'
                                            : 'text-white hover:bg-green-700'
                                            }`}
                                    >
                                        <User className="w-5 h-5" />
                                        {user?.name || 'প্রোফাইল'}
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 px-5 py-3.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all duration-300 shadow-lg"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        লগআউট
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="h-0.5 w-full bg-green-600 my-2"></div>
                                    <Link
                                        to="/login"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold transition-all duration-300 ${isActive('/login')
                                            ? 'bg-white text-green-800 shadow-lg'
                                            : 'text-green-100 hover:text-white hover:bg-green-700'
                                            }`}
                                    >
                                        <User className="w-5 h-5" />
                                        অ্যাডমিন লগইন
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;