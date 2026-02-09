import { useState, useEffect } from 'react';
import { Search, Filter, CheckCircle, XCircle, Mail, Phone, GraduationCap, Edit, Trash2, CreditCard } from 'lucide-react';
import api from '../Services/api';
import toast from 'react-hot-toast';

const RegistrationsTab = ({
    registrations,
    allRegistrations,
    searchTerm,
    setSearchTerm,
    filterBatch,
    setFilterBatch,
    filterPayment,
    setFilterPayment,
    batches,
    selectedIds,
    toggleSelection,
    toggleSelectAll,
    handlePaymentStatusUpdate,
    handleBulkPaymentUpdate,
    handleDeleteRegistration,
    onEdit
}) => {
    const [transactionSearch, setTransactionSearch] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    const [searching, setSearching] = useState(false);

    // Auto-search effect with debounce
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (transactionSearch.trim()) {
                handleTransactionSearch();
            } else {
                // Clear results if search is empty
                setSearchResults(null);
            }
        }, 500); // 500ms debounce delay

        return () => clearTimeout(delayDebounce);
    }, [transactionSearch]);

    const handleTransactionSearch = async () => {
        if (!transactionSearch.trim()) {
            setSearchResults(null);
            return;
        }

        setSearching(true);
        try {
            const response = await api.get(`/iftar/registrations/search?transactionId=${transactionSearch}`);
            setSearchResults(response.data.data);
            if (response.data.data.length === 0) {
                // Don't show error toast for auto-search, just show empty results
            }
        } catch (error) {
            console.error('Search error:', error);
            // Don't show error toast for auto-search
        } finally {
            setSearching(false);
        }
    };

    const clearSearch = () => {
        setTransactionSearch('');
        setSearchResults(null);
    };

    const displayRegistrations = searchResults !== null ? searchResults : registrations;

    return (
        <div className="space-y-6">
            {/* Filters and Search */}
            <div className="bg-white rounded-2xl p-6 shadow-xl">
                {/* Transaction ID Search */}
                <div className="mb-6 p-5 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200">
                    <h3 className="text-lg font-black text-black mb-3 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                        ট্রানজেকশন আইডি দিয়ে সার্চ করুন (অটো-সার্চ চালু আছে)
                    </h3>
                    <div className="flex gap-3">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
                            <input
                                type="text"
                                value={transactionSearch}
                                onChange={(e) => setTransactionSearch(e.target.value)}
                                placeholder="ট্রানজেকশন আইডি লিখুন... (টাইপ করলেই সার্চ হবে)"
                                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-blue-300 rounded-xl focus:outline-none focus:border-blue-500 transition-all font-bold text-black"
                            />
                            {searching && (
                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}
                        </div>
                        {searchResults !== null && (
                            <button
                                onClick={clearSearch}
                                className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors font-bold"
                            >
                                ❌ ক্লিয়ার
                            </button>
                        )}
                    </div>
                    {searchResults !== null && (
                        <p className="mt-3 text-sm text-blue-700 font-bold">
                            {searchResults.length > 0
                                ? `✅ ${searchResults.length} টি রেজিস্ট্রেশন পাওয়া গেছে`
                                : '❌ কোনো রেজিস্ট্রেশন পাওয়া যায়নি'
                            }
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="md:col-span-2">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="নাম, ইমেইল বা মোবাইল দিয়ে খুঁজুন..."
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 transition-all"
                                disabled={searchResults !== null}
                            />
                        </div>
                    </div>

                    {/* Batch Filter */}
                    <div>
                        <select
                            value={filterBatch}
                            onChange={(e) => setFilterBatch(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 transition-all"
                        >
                            <option value="">সকল ব্যাচ</option>
                            {batches.map(batch => (
                                <option key={batch} value={batch}>{batch}</option>
                            ))}
                        </select>
                    </div>

                    {/* Payment Filter */}
                    <div>
                        <select
                            value={filterPayment}
                            onChange={(e) => setFilterPayment(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 transition-all"
                        >
                            <option value="">সকল স্ট্যাটাস</option>
                            <option value="paid">পেইড</option>
                            <option value="unpaid">আনপেইড</option>
                        </select>
                    </div>
                </div>

                {/* Bulk Actions */}
                {selectedIds.length > 0 && (
                    <div className="mt-4 flex items-center gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                        <span className="font-semibold text-gray-700">
                            {selectedIds.length} জন নির্বাচিত
                        </span>
                        <button
                            onClick={() => handleBulkPaymentUpdate(true)}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
                        >
                            ✅ পেইড চিহ্নিত করুন
                        </button>
                        <button
                            onClick={() => handleBulkPaymentUpdate(false)}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold"
                        >
                            ❌ আনপেইড চিহ্নিত করুন
                        </button>
                    </div>
                )}
            </div>

            {/* Registrations Table */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                            <tr>
                                <th className="px-6 py-4 text-left">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.length === registrations.length && registrations.length > 0}
                                        onChange={toggleSelectAll}
                                        className="w-5 h-5 cursor-pointer"
                                    />
                                </th>
                                <th className="px-6 py-4 text-left font-bold">নাম</th>
                                <th className="px-6 py-4 text-left font-bold">ব্যাচ</th>
                                <th className="px-6 py-4 text-left font-bold">মোবাইল</th>
                                <th className="px-6 py-4 text-left font-bold">পেমেন্ট পদ্ধতি</th>
                                <th className="px-6 py-4 text-left font-bold">পেমেন্ট মাধ্যম</th>
                                <th className="px-6 py-4 text-left font-bold">ট্রানজেকশন আইডি</th>
                                <th className="px-6 py-4 text-left font-bold">পেমেন্ট স্ট্যাটাস</th>
                                <th className="px-6 py-4 text-center font-bold">ম্যানেজ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayRegistrations.length > 0 ? (
                                displayRegistrations.map((reg, index) => (
                                    <tr
                                        key={reg.id}
                                        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                                            }`}
                                    >
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(reg.id)}
                                                onChange={() => toggleSelection(reg.id)}
                                                className="w-5 h-5 cursor-pointer"
                                            />
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-gray-800">{reg.name}</td>
                                        <td className="px-6 py-4 text-gray-600">{reg.batch}</td>
                                        <td className="px-6 py-4 text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-gray-400" />
                                                {reg.mobile}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${reg.paymentMethod === 'cash'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                {reg.paymentMethod === 'cash' ? '💵 নগদ' : '💳 অনলাইন'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {reg.paymentMedium ? (
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${reg.paymentMedium === 'bkash'
                                                    ? 'bg-pink-100 text-pink-700'
                                                    : 'bg-orange-100 text-orange-700'
                                                    }`}>
                                                    {reg.paymentMedium === 'bkash' ? '📱 বিকাশ' : '💳 নগদ'}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 text-sm">—</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {reg.transactionId ? (
                                                <span className="font-mono text-sm font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded">
                                                    {reg.transactionId}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 text-sm">প্রযোজ্য নয়</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-2">
                                                <span className={`px-4 py-2 rounded-full text-sm font-bold text-center ${reg.paymentStatus
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-orange-100 text-orange-700'
                                                    }`}>
                                                    {reg.paymentStatus ? '✅ পেইড' : '⏳ আনপেইড'}
                                                </span>
                                                <button
                                                    onClick={() => handlePaymentStatusUpdate(reg.id, !reg.paymentStatus)}
                                                    className={`px-4 py-2 rounded-lg font-semibold text-xs transition-colors border ${reg.paymentStatus
                                                        ? 'bg-white text-orange-600 border-orange-200 hover:bg-orange-50'
                                                        : 'bg-white text-green-600 border-green-200 hover:bg-green-50'
                                                        }`}
                                                >
                                                    {reg.paymentStatus ? 'আনপেইড করুন' : 'পেইড নিশ্চিত করুন'}
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-2">
                                                <button
                                                    onClick={() => onEdit(reg)}
                                                    className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-bold"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                    এডিট
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteRegistration(reg.id)}
                                                    className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-bold"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    মুছুন
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="10" className="px-6 py-12 text-center text-gray-500">
                                        কোনো রেজিস্ট্রেশন পাওয়া যায়নি
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Summary Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">
                            মোট: <strong>{displayRegistrations.length}</strong> জন
                            {searchTerm || filterBatch || filterPayment ? ` (${allRegistrations.length} এর মধ্যে)` : ''}
                        </span>
                        <span className="text-gray-600">
                            পেইড: <strong className="text-green-600">{displayRegistrations.filter(r => r.paymentStatus).length}</strong> |
                            আনপেইড: <strong className="text-orange-600">{displayRegistrations.filter(r => !r.paymentStatus).length}</strong>
                        </span>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default RegistrationsTab;
