import { useState } from 'react';
import { Download, FileText, Users, DollarSign } from 'lucide-react';
import * as XLSX from 'xlsx';

const ReportsTab = ({ registrations, expenses, financials, batches }) => {
    const [selectedBatch, setSelectedBatch] = useState('');

    const generateRegistrationExcel = (batch = '') => {
        const data = batch
            ? registrations.filter(r => r.batch === batch)
            : registrations;

        const excelData = data.map(r => ({
            'নাম': r.name,
            'ডিপার্টমেন্ট': r.department,
            'ব্যাচ': r.batch,
            'মোবাইল': r.mobile,
            'ইমেইল': r.email,
            'পেমেন্ট স্ট্যাটাস': r.paymentStatus ? 'পেইড' : 'আনপেইড'
        }));

        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");

        // Auto-width for columns
        const maxWidth = excelData.reduce((w, r) => Math.max(w, r['নাম'].length), 10);
        worksheet['!cols'] = [
            { wch: maxWidth + 5 }, // Name
            { wch: 15 }, // Department
            { wch: 10 }, // Batch
            { wch: 15 }, // Mobile
            { wch: 25 }, // Email
            { wch: 15 }  // Status
        ];

        XLSX.writeFile(workbook, `registrations${batch ? `_${batch}` : ''}_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    const generateFinancialExcel = () => {
        const summaryData = [
            { 'বিবরণ': 'মোট পেইড ব্যবহারকারী', 'পরিমাণ': financials.paidUsers },
            { 'বিবরণ': 'মোট সংগৃহীত (৳)', 'পরিমাণ': financials.totalCollected },
            { 'বিবরণ': 'মোট খরচ (৳)', 'পরিমাণ': financials.totalExpenses },
            { 'বিবরণ': 'অবশিষ্ট ব্যালেন্স (৳)', 'পরিমাণ': financials.remainingBalance }
        ];

        const expenseData = expenses.map(e => ({
            'খরচের বিবরণ': e.title,
            'পরিমাণ (৳)': e.amount
        }));

        const wb = XLSX.utils.book_new();

        // Summary Sheet
        const wsSummary = XLSX.utils.json_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(wb, wsSummary, "Financial Summary");
        wsSummary['!cols'] = [{ wch: 30 }, { wch: 15 }];

        // Expenses Sheet
        if (expenseData.length > 0) {
            const wsExpenses = XLSX.utils.json_to_sheet(expenseData);
            XLSX.utils.book_append_sheet(wb, wsExpenses, "Expense Details");
            wsExpenses['!cols'] = [{ wch: 40 }, { wch: 15 }];
        }

        XLSX.writeFile(wb, `financial_report_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    const paidRegistrations = registrations.filter(r => r.paymentStatus);
    const unpaidRegistrations = registrations.filter(r => !r.paymentStatus);

    return (
        <div className="space-y-8">
            {/* Report Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-xl border-l-4 border-blue-500">
                    <div className="flex items-center gap-4">
                        <Users className="w-10 h-10 text-blue-500" />
                        <div>
                            <p className="text-sm text-gray-600 font-medium">মোট রেজিস্ট্রেশন</p>
                            <p className="text-3xl font-bold text-gray-800">{registrations.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-xl border-l-4 border-green-500">
                    <div className="flex items-center gap-4">
                        <Users className="w-10 h-10 text-green-500" />
                        <div>
                            <p className="text-sm text-gray-600 font-medium">পেইড</p>
                            <p className="text-3xl font-bold text-green-600">{paidRegistrations.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-xl border-l-4 border-orange-500">
                    <div className="flex items-center gap-4">
                        <Users className="w-10 h-10 text-orange-500" />
                        <div>
                            <p className="text-sm text-gray-600 font-medium">আনপেইড</p>
                            <p className="text-3xl font-bold text-orange-600">{unpaidRegistrations.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-xl border-l-4 border-purple-500">
                    <div className="flex items-center gap-4">
                        <DollarSign className="w-10 h-10 text-purple-500" />
                        <div>
                            <p className="text-sm text-gray-600 font-medium">মোট খরচ</p>
                            <p className="text-3xl font-bold text-purple-600">{expenses.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Download Reports */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Registration Reports */}
                <div className="bg-white rounded-2xl p-8 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <FileText className="w-6 h-6 text-emerald-600" />
                        <h3 className="text-2xl font-bold text-gray-800">রেজিস্ট্রেশন রিপোর্ট</h3>
                    </div>

                    <div className="space-y-4">
                        {/* All Registrations */}
                        <button
                            onClick={() => generateRegistrationExcel()}
                            className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl hover:from-emerald-100 hover:to-teal-100 transition-all border border-emerald-200"
                        >
                            <div className="flex items-center gap-3">
                                <Download className="w-5 h-5 text-emerald-600" />
                                <div className="text-left">
                                    <p className="font-semibold text-gray-800">সকল রেজিস্ট্রেশন</p>
                                    <p className="text-sm text-gray-600">{registrations.length} জন</p>
                                </div>
                            </div>
                            <span className="text-emerald-600 font-bold">Excel ডাউনলোড</span>
                        </button>

                        {/* Batch-wise */}
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                            <p className="font-semibold text-gray-800 mb-3">ব্যাচ অনুযায়ী ডাউনলোড</p>
                            <div className="flex gap-2">
                                <select
                                    value={selectedBatch}
                                    onChange={(e) => setSelectedBatch(e.target.value)}
                                    className="flex-1 px-4 py-2 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500"
                                >
                                    <option value="">ব্যাচ নির্বাচন করুন</option>
                                    {batches.map(batch => (
                                        <option key={batch} value={batch}>{batch}</option>
                                    ))}
                                </select>
                                <button
                                    onClick={() => selectedBatch && generateRegistrationExcel(selectedBatch)}
                                    disabled={!selectedBatch}
                                    className={`px-6 py-2 rounded-lg font-semibold transition-colors ${selectedBatch
                                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                >
                                    <Download className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Paid Only */}
                        <button
                            onClick={() => {
                                const data = paidRegistrations.map(r => ({
                                    'নাম': r.name,
                                    'ডিপার্টমেন্ট': r.department,
                                    'ব্যাচ': r.batch,
                                    'মোবাইল': r.mobile,
                                    'ইমেইল': r.email,
                                    'পেমেন্ট স্ট্যাটাস': 'পেইড'
                                }));
                                const ws = XLSX.utils.json_to_sheet(data);
                                const wb = XLSX.utils.book_new();
                                XLSX.utils.book_append_sheet(wb, ws, "Paid Registrations");
                                ws['!cols'] = [{ wch: 20 }, { wch: 15 }, { wch: 10 }, { wch: 15 }, { wch: 25 }, { wch: 10 }];
                                XLSX.writeFile(wb, `paid_registrations_${new Date().toISOString().split('T')[0]}.xlsx`);
                            }}
                            className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-all border border-green-200"
                        >
                            <div className="flex items-center gap-3">
                                <Download className="w-5 h-5 text-green-600" />
                                <div className="text-left">
                                    <p className="font-semibold text-gray-800">শুধুমাত্র পেইড</p>
                                    <p className="text-sm text-gray-600">{paidRegistrations.length} জন</p>
                                </div>
                            </div>
                            <span className="text-green-600 font-bold">Excel ডাউনলোড</span>
                        </button>

                        {/* Unpaid Only */}
                        <button
                            onClick={() => {
                                const data = unpaidRegistrations.map(r => ({
                                    'নাম': r.name,
                                    'ডিপার্টমেন্ট': r.department,
                                    'ব্যাচ': r.batch,
                                    'মোবাইল': r.mobile,
                                    'ইমেইল': r.email,
                                    'পেমেন্ট স্ট্যাটাস': 'আনপেইড'
                                }));
                                const ws = XLSX.utils.json_to_sheet(data);
                                const wb = XLSX.utils.book_new();
                                XLSX.utils.book_append_sheet(wb, ws, "Unpaid Registrations");
                                ws['!cols'] = [{ wch: 20 }, { wch: 15 }, { wch: 10 }, { wch: 15 }, { wch: 25 }, { wch: 10 }];
                                XLSX.writeFile(wb, `unpaid_registrations_${new Date().toISOString().split('T')[0]}.xlsx`);
                            }}
                            className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl hover:from-orange-100 hover:to-red-100 transition-all border border-orange-200"
                        >
                            <div className="flex items-center gap-3">
                                <Download className="w-5 h-5 text-orange-600" />
                                <div className="text-left">
                                    <p className="font-semibold text-gray-800">শুধুমাত্র আনপেইড</p>
                                    <p className="text-sm text-gray-600">{unpaidRegistrations.length} জন</p>
                                </div>
                            </div>
                            <span className="text-orange-600 font-bold">Excel ডাউনলোড</span>
                        </button>
                    </div>
                </div>

                {/* Financial Reports */}
                <div className="bg-white rounded-2xl p-8 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <DollarSign className="w-6 h-6 text-teal-600" />
                        <h3 className="text-2xl font-bold text-gray-800">আর্থিক রিপোর্ট</h3>
                    </div>

                    <div className="space-y-6">
                        {/* Financial Summary */}
                        <div className="p-6 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border border-teal-200">
                            <h4 className="font-bold text-gray-800 mb-4">আর্থিক সারসংক্ষেপ</h4>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">মোট পেইড ব্যবহারকারী:</span>
                                    <span className="font-bold text-gray-800">{financials.paidUsers} জন</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">মোট সংগৃহীত:</span>
                                    <span className="font-bold text-teal-600">৳{financials.totalCollected}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">মোট খরচ:</span>
                                    <span className="font-bold text-orange-600">৳{financials.totalExpenses}</span>
                                </div>
                                <div className="flex justify-between pt-3 border-t-2 border-teal-300">
                                    <span className="text-gray-800 font-semibold">অবশিষ্ট ব্যালেন্স:</span>
                                    <span className={`font-bold text-xl ${financials.remainingBalance >= 0 ? 'text-cyan-600' : 'text-red-600'}`}>
                                        ৳{financials.remainingBalance}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Download Button */}
                        <button
                            onClick={generateFinancialExcel}
                            className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl hover:shadow-lg transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <Download className="w-5 h-5" />
                                <div className="text-left">
                                    <p className="font-semibold">সম্পূর্ণ আর্থিক রিপোর্ট</p>
                                    <p className="text-sm text-teal-100">সকল তথ্য সহ</p>
                                </div>
                            </div>
                            <span className="font-bold">Excel ডাউনলোড</span>
                        </button>

                        {/* Expense Breakdown */}
                        <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                            <h4 className="font-bold text-gray-800 mb-4">খরচের বিভাজন</h4>
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {expenses.length > 0 ? (
                                    expenses.map((exp) => (
                                        <div key={exp.id} className="flex justify-between items-center p-3 bg-white rounded-lg">
                                            <span className="text-gray-700 font-medium">{exp.title}</span>
                                            <span className="font-bold text-orange-600">৳{exp.amount}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center py-4">কোনো খরচ নেই</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Batch-wise Statistics */}
            <div className="bg-white rounded-2xl p-8 shadow-xl">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">ব্যাচ অনুযায়ী পরিসংখ্যান</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {batches.map(batch => {
                        const batchRegs = registrations.filter(r => r.batch === batch);
                        const batchPaid = batchRegs.filter(r => r.paymentStatus).length;
                        const percentage = batchRegs.length > 0 ? ((batchPaid / batchRegs.length) * 100).toFixed(0) : 0;

                        return (
                            <div key={batch} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-bold text-gray-800">{batch}</h4>
                                    <span className="text-sm font-semibold text-emerald-600">{percentage}%</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">মোট:</span>
                                        <span className="font-semibold">{batchRegs.length}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">পেইড:</span>
                                        <span className="font-semibold text-green-600">{batchPaid}</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ReportsTab;
