import { Search, Filter, CheckCircle, XCircle, Mail, Phone, GraduationCap, Edit, Trash2 } from 'lucide-react';

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
    return (
        <div className="space-y-6">
            {/* Filters and Search */}
            <div className="bg-white rounded-2xl p-6 shadow-xl">
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
                                <th className="px-6 py-4 text-left font-bold">ইমেইল</th>
                                <th className="px-6 py-4 text-left font-bold">পেমেন্ট স্ট্যাটাস</th>
                                <th className="px-6 py-4 text-center font-bold">ম্যানেজ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registrations.length > 0 ? (
                                registrations.map((reg, index) => (
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
                                        <td className="px-6 py-4 text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-4 h-4 text-gray-400" />
                                                {reg.email}
                                            </div>
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
                                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
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
                            মোট: <strong>{registrations.length}</strong> জন
                            {searchTerm || filterBatch || filterPayment ? ` (${allRegistrations.length} এর মধ্যে)` : ''}
                        </span>
                        <span className="text-gray-600">
                            পেইড: <strong className="text-green-600">{registrations.filter(r => r.paymentStatus).length}</strong> |
                            আনপেইড: <strong className="text-orange-600">{registrations.filter(r => !r.paymentStatus).length}</strong>
                        </span>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default RegistrationsTab;
