import { Plus, Trash2, X, Calendar, Receipt } from 'lucide-react';

const ExpensesTab = ({
    expenses,
    showExpenseForm,
    setShowExpenseForm,
    expenseData,
    setExpenseData,
    handleAddExpense,
    handleDeleteExpense,
    financials
}) => {
    return (
        <div className="space-y-6">
            {/* Add Expense Button */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">খরচ ব্যবস্থাপনা</h2>
                <button
                    onClick={() => setShowExpenseForm(!showExpenseForm)}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                >
                    {showExpenseForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    {showExpenseForm ? 'বাতিল করুন' : 'নতুন খরচ যোগ করুন'}
                </button>
            </div>

            {/* Add Expense Form */}
            {showExpenseForm && (
                <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-emerald-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">নতুন খরচ যোগ করুন</h3>
                    <form onSubmit={handleAddExpense} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">
                                শিরোনাম <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={expenseData.title}
                                onChange={(e) => setExpenseData({ ...expenseData, title: e.target.value })}
                                placeholder="যেমন: বাস ভাড়া, খাবার, ব্যানার"
                                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">
                                পরিমাণ (টাকা) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                value={expenseData.amount}
                                onChange={(e) => setExpenseData({ ...expenseData, amount: e.target.value })}
                                placeholder="0"
                                min="1"
                                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">
                                নোট (ঐচ্ছিক)
                            </label>
                            <textarea
                                value={expenseData.note}
                                onChange={(e) => setExpenseData({ ...expenseData, note: e.target.value })}
                                placeholder="অতিরিক্ত তথ্য..."
                                rows="3"
                                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 transition-all resize-none"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300"
                        >
                            ✅ খরচ যোগ করুন
                        </button>
                    </form>
                </div>
            )}

            {/* Financial Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-6 border border-teal-200">
                    <p className="text-sm text-gray-600 font-medium mb-2">মোট সংগৃহীত</p>
                    <p className="text-3xl font-bold text-teal-600">৳{financials.totalCollected}</p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
                    <p className="text-sm text-gray-600 font-medium mb-2">মোট খরচ</p>
                    <p className="text-3xl font-bold text-orange-600">৳{financials.totalExpenses}</p>
                </div>

                <div className={`bg-gradient-to-br ${financials.remainingBalance >= 0 ? 'from-cyan-50 to-cyan-100 border-cyan-200' : 'from-red-50 to-red-100 border-red-200'} rounded-2xl p-6 border`}>
                    <p className="text-sm text-gray-600 font-medium mb-2">অবশিষ্ট ব্যালেন্স</p>
                    <p className={`text-3xl font-bold ${financials.remainingBalance >= 0 ? 'text-cyan-600' : 'text-red-600'}`}>
                        ৳{financials.remainingBalance}
                    </p>
                </div>
            </div>

            {/* Expenses List */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
                    <h3 className="text-xl font-bold text-white">খরচের তালিকা</h3>
                </div>

                <div className="p-6">
                    {expenses.length > 0 ? (
                        <div className="space-y-4">
                            {expenses.map((expense) => (
                                <div
                                    key={expense.id}
                                    className="flex items-center justify-between p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Receipt className="w-5 h-5 text-gray-400" />
                                            <h4 className="text-lg font-bold text-gray-800">{expense.title}</h4>
                                        </div>
                                        {expense.note && (
                                            <p className="text-sm text-gray-600 ml-8">{expense.note}</p>
                                        )}
                                        <div className="flex items-center gap-2 mt-2 ml-8">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <p className="text-xs text-gray-500">
                                                {new Date(expense.createdAt).toLocaleDateString('bn-BD', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <span className="text-2xl font-bold text-orange-600">৳{expense.amount}</span>
                                        <button
                                            onClick={() => handleDeleteExpense(expense.id)}
                                            className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                            title="মুছে ফেলুন"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">💰</div>
                            <p className="text-xl text-gray-500 font-semibold">এখনও কোনো খরচ যোগ করা হয়নি</p>
                            <p className="text-gray-400 mt-2">উপরের বাটনে ক্লিক করে নতুন খরচ যোগ করুন</p>
                        </div>
                    )}
                </div>

                {/* Total Footer */}
                {expenses.length > 0 && (
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 font-semibold">
                                মোট খরচ সংখ্যা: <strong>{expenses.length}</strong> টি
                            </span>
                            <span className="text-xl font-bold text-orange-600">
                                সর্বমোট: ৳{financials.totalExpenses}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExpensesTab;
