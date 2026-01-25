import { TrendingUp, Users, DollarSign, Calendar } from 'lucide-react';

const OverviewTab = ({ registrations, expenses, financials }) => {
    const recentRegistrations = registrations.slice(0, 5);
    const recentExpenses = expenses.slice(0, 5);

    const paidPercentage = registrations.length > 0
        ? ((financials.paidUsers / registrations.length) * 100).toFixed(1)
        : 0;

    return (
        <div className="space-y-8">
            {/* Progress Bar */}
            <div className="bg-white rounded-2xl p-8 shadow-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">পেমেন্ট অগ্রগতি</h3>
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700 font-bold">
                            {financials.paidUsers} / {registrations.length} জন পেমেন্ট সম্পন্ন করেছেন
                        </span>
                        <span className="text-2xl font-bold text-emerald-700">{paidPercentage}%</span>
                    </div>
                    <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-1000"
                            style={{ width: `${paidPercentage}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Registrations */}
                <div className="bg-white rounded-2xl p-8 shadow-xl">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Users className="w-6 h-6 text-emerald-700" />
                        সাম্প্রতিক রেজিস্ট্রেশন
                    </h3>
                    <div className="space-y-4">
                        {recentRegistrations.map((reg) => (
                            <div key={reg.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div>
                                    <p className="font-bold text-gray-900">{reg.name}</p>
                                    <p className="text-sm text-gray-700 font-medium">{reg.batch} | {reg.mobile}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-bold ${reg.paymentStatus
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-orange-100 text-orange-800'
                                    }`}>
                                    {reg.paymentStatus ? 'পেইড' : 'আনপেইড'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Expenses */}
                <div className="bg-white rounded-2xl p-8 shadow-xl">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <DollarSign className="w-6 h-6 text-orange-600" />
                        সাম্প্রতিক খরচ
                    </h3>
                    <div className="space-y-4">
                        {recentExpenses.length > 0 ? (
                            recentExpenses.map((exp) => (
                                <div key={exp.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div>
                                        <p className="font-bold text-gray-900">{exp.title}</p>
                                        {exp.note && <p className="text-sm text-gray-700">{exp.note}</p>}
                                    </div>
                                    <span className="text-lg font-bold text-orange-700">৳{exp.amount}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-8">এখনও কোনো খরচ যোগ করা হয়নি</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-sm text-blue-900 font-bold">মোট রেজিস্ট্রেশন</p>
                            <p className="text-3xl font-black text-gray-900">{registrations.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-sm text-purple-900 font-bold">মোট খরচ সংখ্যা</p>
                            <p className="text-3xl font-black text-gray-900">{expenses.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-sm text-emerald-900 font-bold">গড় খরচ</p>
                            <p className="text-3xl font-black text-gray-900">
                                ৳{expenses.length > 0 ? Math.round(financials.totalExpenses / expenses.length) : 0}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OverviewTab;
