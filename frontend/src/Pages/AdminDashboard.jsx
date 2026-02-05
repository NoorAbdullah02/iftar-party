import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../Services/api';
import toast from 'react-hot-toast';
import {
    Users, DollarSign, TrendingUp, TrendingDown, Plus, Trash2, Download,
    Search, Filter, CheckCircle, XCircle, Calendar, Receipt, FileText, LayoutDashboard
} from 'lucide-react';

// Import tab components
import OverviewTab from '../Components/OverviewTab';
import RegistrationsTab from '../Components/RegistrationsTab';
import ExpensesTab from '../Components/ExpensesTab';
import ReportsTab from '../Components/ReportsTab';
import EditRegistrationModal from '../Components/EditRegistrationModal';

const AdminDashboard = () => {
    const { isLoggedIn, user } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('overview');
    const [registrations, setRegistrations] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [financials, setFinancials] = useState({
        paidUsers: 0,
        totalCollected: 0,
        totalExpenses: 0,
        remainingBalance: 0
    });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterBatch, setFilterBatch] = useState('');
    const [filterPayment, setFilterPayment] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);

    // Expense form
    const [showExpenseForm, setShowExpenseForm] = useState(false);
    const [expenseData, setExpenseData] = useState({
        title: '',
        amount: '',
        note: ''
    });

    // Registration Edit Modal
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingRegistration, setEditingRegistration] = useState(null);

    const dashboardRef = useRef(null);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }
        fetchData();
    }, [isLoggedIn, navigate]);



    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('accessToken');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            const [regsRes, expsRes, finRes] = await Promise.all([
                api.get('/iftar/registrations'),
                api.get('/iftar/expenses'),
                api.get('/iftar/financials')
            ]);

            setRegistrations(regsRes.data.data || []);
            setExpenses(expsRes.data.data || []);
            setFinancials(finRes.data.data || {});
        } catch (error) {
            console.error('Fetch error:', error);
            toast.error('ডেটা লোড করতে ব্যর্থ হয়েছে');
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentStatusUpdate = (id, status) => {
        toast((t) => (
            <div className="flex flex-col gap-3 min-w-[280px]">
                <div>
                    <p className="font-bold text-gray-800 text-lg">পেমেন্ট স্ট্যাটাস পরিবর্তন?</p>
                    <p className="text-sm text-gray-500 font-medium">
                        আপনি কি নিশ্চিত যে আপনি পেমেন্ট স্ট্যাটাস <span className={`font-bold ${status ? 'text-green-600' : 'text-orange-600'}`}>{status ? 'পেইড' : 'আনপেইড'}</span> হিসেবে মার্ক করতে চান?
                    </p>
                </div>
                <div className="flex gap-3 justify-end mt-1">
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-bold transition-colors"
                    >
                        বাতিল
                    </button>
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id);
                            try {
                                await api.patch(`/iftar/registrations/${id}/payment`, { status });
                                toast.success(status ? '✅ পেমেন্ট সম্পন্ন চিহ্নিত করা হয়েছে' : '❌ পেমেন্ট বাতিল করা হয়েছে');
                                fetchData();
                            } catch (error) {
                                console.error('Payment update error:', error);
                                toast.error('পেমেন্ট আপডেট ব্যর্থ হয়েছে');
                            }
                        }}
                        className={`px-4 py-2 text-white rounded-lg text-sm font-bold transition-colors shadow-lg ${status
                            ? 'bg-green-600 hover:bg-green-700 shadow-green-500/30'
                            : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/30'
                            }`}
                    >
                        হ্যাঁ, পরিবর্তন করুন
                    </button>
                </div>
            </div>
        ), {
            duration: Infinity,
            position: 'top-center',
            style: {
                background: '#fff',
                padding: '24px',
                borderRadius: '20px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                border: '2px solid #e2e8f0'
            },
        });
    };

    const handleDeleteRegistration = (id) => {
        toast((t) => (
            <div className="flex flex-col gap-3 min-w-[280px]">
                <div>
                    <p className="font-bold text-gray-800 text-lg">আপনি কি নিশ্চিত?</p>
                    <p className="text-sm text-gray-500 font-medium">এই রেজিস্ট্রেশনটি মুছে ফেলা হবে। এটি আর পুনরুদ্ধার করা সম্ভব নয়!</p>
                </div>
                <div className="flex gap-3 justify-end mt-1">
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-bold transition-colors"
                    >
                        বাতিল
                    </button>
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id);
                            try {
                                await api.delete(`/iftar/registrations/${id}`);
                                toast.success('🗑️ রেজিস্ট্রেশন সফলভাবে মুছে ফেলা হয়েছে');
                                fetchData();
                            } catch (error) {
                                console.error('Delete registration error:', error);
                                toast.error('রেজিস্ট্রেশন মুছতে ব্যর্থ হয়েছে');
                            }
                        }}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-bold transition-colors shadow-lg shadow-red-500/30"
                    >
                        হ্যাঁ, মুছুন
                    </button>
                </div>
            </div>
        ), {
            duration: Infinity,
            position: 'top-center',
            style: {
                background: '#fff',
                padding: '24px',
                borderRadius: '20px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                border: '2px solid #fee2e2'
            },
        });
    };

    const handleEditRegistration = async (id, data) => {
        try {
            await api.put(`/iftar/registrations/${id}`, data);
            toast.success('✏️ রেজিস্ট্রেশন আপডেট করা হয়েছে');
            setShowEditModal(false);
            setEditingRegistration(null);
            fetchData();
        } catch (error) {
            console.error('Update registration error:', error);
            toast.error('রেজিস্ট্রেশন আপডেট করতে ব্যর্থ হয়েছে');
        }
    };

    const openEditModal = (registration) => {
        setEditingRegistration(registration);
        setShowEditModal(true);
    };

    const handleBulkPaymentUpdate = (status) => {
        if (selectedIds.length === 0) {
            toast.error('অনুগ্রহ করে কমপক্ষে একজন নির্বাচন করুন');
            return;
        }

        toast((t) => (
            <div className="flex flex-col gap-3 min-w-[280px]">
                <div>
                    <p className="font-bold text-gray-800 text-lg">বাল্ক স্ট্যাটাস পরিবর্তন?</p>
                    <p className="text-sm text-gray-500 font-medium">
                        আপনি {selectedIds.length} জনের পেমেন্ট স্ট্যাটাস <span className={`font-bold ${status ? 'text-green-600' : 'text-orange-600'}`}>{status ? 'পেইড' : 'আনপেইড'}</span> হিসেবে মার্ক করতে যাচ্ছেন।
                    </p>
                </div>
                <div className="flex gap-3 justify-end mt-1">
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-bold transition-colors"
                    >
                        বাতিল
                    </button>
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id);
                            try {
                                await api.patch('/iftar/registrations/payment/bulk', { ids: selectedIds, status });
                                toast.success(`✅ ${selectedIds.length} জনের পেমেন্ট আপডেট করা হয়েছে`);
                                setSelectedIds([]);
                                fetchData();
                            } catch (error) {
                                console.error('Bulk payment update error:', error);
                                toast.error('পেমেন্ট আপডেট ব্যর্থ হয়েছে');
                            }
                        }}
                        className={`px-4 py-2 text-white rounded-lg text-sm font-bold transition-colors shadow-lg ${status
                            ? 'bg-green-600 hover:bg-green-700 shadow-green-500/30'
                            : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/30'
                            }`}
                    >
                        হ্যাঁ, আপডেট করুন
                    </button>
                </div>
            </div>
        ), {
            duration: Infinity,
            position: 'top-center',
            style: {
                background: '#fff',
                padding: '24px',
                borderRadius: '20px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                border: '2px solid #e2e8f0'
            },
        });
    };

    const handleAddExpense = async (e) => {
        e.preventDefault();

        if (!expenseData.title || !expenseData.amount) {
            toast.error('শিরোনাম এবং পরিমাণ আবশ্যক');
            return;
        }

        try {
            await api.post('/iftar/expenses', {
                title: expenseData.title,
                amount: Number(expenseData.amount),
                note: expenseData.note
            });

            toast.success('✅ খরচ যোগ করা হয়েছে');
            setExpenseData({ title: '', amount: '', note: '' });
            setShowExpenseForm(false);
            fetchData();
        } catch (error) {
            console.error('Add expense error:', error);
            toast.error('খরচ যোগ করতে ব্যর্থ হয়েছে');
        }
    };

    const handleDeleteExpense = (id) => {
        toast((t) => (
            <div className="flex flex-col gap-3 min-w-[280px]">
                <div>
                    <p className="font-bold text-gray-800 text-lg">খরচ মুছতে চান?</p>
                    <p className="text-sm text-gray-500 font-medium">আপনি কি নিশ্চিত যে আপনি এই খরচটি মুছে ফেলতে চান?</p>
                </div>
                <div className="flex gap-3 justify-end mt-1">
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-bold transition-colors"
                    >
                        না
                    </button>
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id);
                            try {
                                await api.delete(`/iftar/expenses/${id}`);
                                toast.success('🗑️ খরচ মুছে ফেলা হয়েছে');
                                fetchData();
                            } catch (error) {
                                console.error('Delete expense error:', error);
                                toast.error('খরচ মুছতে ব্যর্থ হয়েছে');
                            }
                        }}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-bold transition-colors shadow-lg shadow-red-500/30"
                    >
                        হ্যাঁ, মুছুন
                    </button>
                </div>
            </div>
        ), {
            duration: Infinity,
            position: 'top-center',
            style: {
                background: '#fff',
                padding: '24px',
                borderRadius: '20px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                border: '2px solid #fee2e2'
            },
        });
    };

    const toggleSelection = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredRegistrations.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredRegistrations.map(r => r.id));
        }
    };

    // Filter registrations
    const filteredRegistrations = registrations.filter(reg => {
        const matchesSearch = reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reg.mobile.includes(searchTerm);
        const matchesBatch = !filterBatch || reg.batch === filterBatch;
        const matchesPayment = !filterPayment ||
            (filterPayment === 'paid' && reg.paymentStatus) ||
            (filterPayment === 'unpaid' && !reg.paymentStatus);

        return matchesSearch && matchesBatch && matchesPayment;
    });

    const batches = [...new Set(registrations.map(r => r.batch))];

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-xl text-black font-bold">লোড হচ্ছে...</p>
                </div>
            </div>
        );
    }

    return (
        <div ref={dashboardRef} className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 p-6 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-100 rounded-2xl">
                            <LayoutDashboard className="w-8 h-8 text-emerald-700" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-gray-800">
                                Admin Dashboard
                            </h1>
                            <p className="text-gray-500 font-medium">ইফতার পার্টি – ২০২৬ | ICE Department</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl font-bold border border-emerald-100 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Live System
                        </div>
                    </div>
                </div>

                {/* Financial Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="stat-card bg-emerald-700 rounded-2xl p-6 text-white shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <Users className="w-10 h-10 opacity-80" />
                            <div className="text-right">
                                <p className="text-emerald-100 text-sm font-bold">পেমেন্ট সম্পন্ন</p>
                                <p className="text-4xl font-black count-up">{financials.paidUsers}</p>
                            </div>
                        </div>
                        <p className="text-emerald-100 text-sm font-medium">মোট ব্যবহারকারী</p>
                    </div>

                    <div className="stat-card bg-teal-700 rounded-2xl p-6 text-white shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <DollarSign className="w-10 h-10 opacity-80" />
                            <div className="text-right">
                                <p className="text-teal-100 text-sm font-bold">মোট সংগৃহীত</p>
                                <p className="text-4xl font-black count-up">৳{financials.totalCollected}</p>
                            </div>
                        </div>
                        <p className="text-teal-100 text-sm font-medium">{financials.paidUsers} × ৪৫০ টাকা</p>
                    </div>

                    <div className="stat-card bg-orange-600 rounded-2xl p-6 text-white shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <TrendingDown className="w-10 h-10 opacity-80" />
                            <div className="text-right">
                                <p className="text-orange-100 text-sm font-bold">মোট খরচ</p>
                                <p className="text-4xl font-black count-up">৳{financials.totalExpenses}</p>
                            </div>
                        </div>
                        <p className="text-orange-100 text-sm font-medium">{expenses.length} টি খরচ</p>
                    </div>

                    <div className={`stat-card ${financials.remainingBalance >= 0 ? 'bg-cyan-700' : 'bg-red-700'} rounded-2xl p-6 text-white shadow-xl`}>
                        <div className="flex items-center justify-between mb-4">
                            <TrendingUp className="w-10 h-10 opacity-80" />
                            <div className="text-right">
                                <p className="text-cyan-100 text-sm font-bold">অবশিষ্ট ব্যালেন্স</p>
                                <p className="text-4xl font-black count-up">৳{financials.remainingBalance}</p>
                            </div>
                        </div>
                        <p className="text-cyan-100 text-sm font-medium">সংগৃহীত - খরচ</p>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
                    {[
                        { id: 'overview', label: 'সারসংক্ষেপ', icon: '📊' },
                        { id: 'registrations', label: 'রেজিস্ট্রেশন', icon: '👥' },
                        { id: 'expenses', label: 'খরচ', icon: '💰' },
                        { id: 'reports', label: 'রিপোর্ট', icon: '📄' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all duration-300 ${activeTab === tab.id
                                ? 'bg-emerald-700 text-white shadow-lg'
                                : 'bg-white text-black hover:bg-gray-100 shadow border border-gray-400'
                                }`}
                        >
                            <span className="mr-2">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                    <OverviewTab
                        registrations={registrations}
                        expenses={expenses}
                        financials={financials}
                    />
                )}

                {activeTab === 'registrations' && (
                    <RegistrationsTab
                        registrations={filteredRegistrations}
                        allRegistrations={registrations}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        filterBatch={filterBatch}
                        setFilterBatch={setFilterBatch}
                        filterPayment={filterPayment}
                        setFilterPayment={setFilterPayment}
                        batches={batches}
                        selectedIds={selectedIds}
                        toggleSelection={toggleSelection}
                        toggleSelectAll={toggleSelectAll}
                        handlePaymentStatusUpdate={handlePaymentStatusUpdate}
                        handleBulkPaymentUpdate={handleBulkPaymentUpdate}
                        handleDeleteRegistration={handleDeleteRegistration}
                        onEdit={openEditModal}
                    />
                )}

                {/* Edit Modal */}
                {showEditModal && (
                    <EditRegistrationModal
                        isOpen={showEditModal}
                        registration={editingRegistration}
                        onClose={() => setShowEditModal(false)}
                        onUpdate={handleEditRegistration}
                    />
                )}

                {activeTab === 'expenses' && (
                    <ExpensesTab
                        expenses={expenses}
                        showExpenseForm={showExpenseForm}
                        setShowExpenseForm={setShowExpenseForm}
                        expenseData={expenseData}
                        setExpenseData={setExpenseData}
                        handleAddExpense={handleAddExpense}
                        handleDeleteExpense={handleDeleteExpense}
                        financials={financials}
                    />
                )}

                {activeTab === 'reports' && (
                    <ReportsTab
                        registrations={registrations}
                        expenses={expenses}
                        financials={financials}
                        batches={batches}
                    />
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
