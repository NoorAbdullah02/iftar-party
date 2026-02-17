import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Mail, GraduationCap, Building2, ChevronDown, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const PicnicRegisterPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        department: 'ICE',
        batch: '',
        mobile: '',
        email: '',
        paymentMethod: '', // 'cash' or 'online'
        paymentMedium: '', // 'bkash' or 'nagad' (only for online)
        transactionId: '' // Only for online payment
    });
    const [showOtherBatch, setShowOtherBatch] = useState(false);
    const [otherBatch, setOtherBatch] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const otherInputRef = useRef(null);
    const formRef = useRef(null);

    const batches = ['13th', '14th', '15th', '16th', '17th', '18th', '19th', 'Others'];

    const handleBatchChange = (e) => {
        const value = e.target.value;
        setFormData({ ...formData, batch: value });

        if (value === 'Others') {
            setShowOtherBatch(true);
        } else {
            setShowOtherBatch(false);
            setOtherBatch('');
        }
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            toast.error('⚠️ অনুগ্রহ করে নাম লিখুন');
            return false;
        }
        if (!formData.batch) {
            toast.error('⚠️ অনুগ্রহ করে ব্যাচ নির্বাচন করুন');
            return false;
        }
        if (formData.batch === 'Others' && !otherBatch.trim()) {
            toast.error('⚠️ অনুগ্রহ করে ব্যাচ লিখুন');
            return false;
        }
        if (!formData.mobile.trim() || !/^01[0-9]{9}$/.test(formData.mobile)) {
            toast.error('⚠️ সঠিক মোবাইল নম্বর লিখুন (১১ ডিজিট)');
            return false;
        }
        if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            toast.error('⚠️ সঠিক ইমেইল ঠিকানা লিখুন');
            return false;
        }
        if (!formData.paymentMethod) {
            toast.error('⚠️ পেমেন্ট পদ্ধতি নির্বাচন করুন');
            return false;
        }
        if (formData.paymentMethod === 'online') {
            if (!formData.paymentMedium) {
                toast.error('⚠️ পেমেন্ট মাধ্যম নির্বাচন করুন (বিকাশ/নগদ)');
                return false;
            }
            if (!formData.transactionId.trim()) {
                toast.error('⚠️ ট্রানজেকশন আইডি লিখুন');
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            const finalBatch = formData.batch === 'Others' ? otherBatch : formData.batch;

            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/iftar/register`, {
                ...formData,
                batch: finalBatch
            });

            if (response.data.success) {
                toast.success('🎉 রেজিস্ট্রেশন সফল হয়েছে!');

                // Navigate to success page with data
                navigate('/iftar-success', {
                    state: {
                        registration: response.data.data
                    }
                });
            }
        } catch (error) {
            console.error('Registration error:', error);
            const errorMessage = error.response?.data?.message || 'রেজিস্ট্রেশন ব্যর্থ হয়েছে';
            toast.error(`❌ ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            toast.success('📋 নম্বর কপি হয়েছে!');
        }).catch(() => {
            toast.error('❌ কপি করতে ব্যর্থ হয়েছে');
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-12 px-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-green-200 to-emerald-300 rounded-full opacity-20 blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-teal-200 to-cyan-300 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div ref={formRef} className="relative z-10 max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-5xl md:text-6xl font-black text-black mb-3">
                        রেজিস্ট্রেশন ফর্ম
                    </h1>
                    <p className="text-xl text-black font-bold">ইফতার পার্টি – ২০২৬ | ICE Department</p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-green-200">
                    {/* Form Header */}
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white">
                        <h2 className="text-2xl font-bold mb-2">আপনার তথ্য দিন</h2>
                        <p className="text-white font-bold">সকল তথ্য সঠিকভাবে পূরণ করুন</p>
                    </div>

                    {/* Form Body */}
                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        {/* Name */}
                        <div>
                            <label className="block text-black font-black mb-2 text-lg">
                                নাম <span className="text-red-600">*</span>
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-800 w-5 h-5" />
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="আপনার পুরো নাম লিখুন"
                                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-500 rounded-xl focus:outline-none focus:border-green-800 transition-all duration-300 text-lg text-black font-bold placeholder-gray-600"
                                    required
                                />
                            </div>
                        </div>

                        {/* Department (Locked) */}
                        <div>
                            <label className="block text-black font-black mb-2 text-lg">
                                ডিপার্টমেন্ট
                            </label>
                            <div className="relative">
                                <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 w-5 h-5" />
                                <input
                                    type="text"
                                    value="ICE"
                                    disabled
                                    className="w-full pl-12 pr-4 py-4 bg-gray-200 border-2 border-gray-500 rounded-xl text-lg text-black font-extrabold cursor-not-allowed"
                                />
                            </div>
                        </div>

                        {/* Batch */}
                        <div>
                            <label className="block text-black font-black mb-2 text-lg">
                                ব্যাচ <span className="text-red-600">*</span>
                            </label>
                            <div className="relative">
                                <GraduationCap className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-800 w-5 h-5 pointer-events-none z-10" />
                                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 w-5 h-5 pointer-events-none" />
                                <select
                                    value={formData.batch}
                                    onChange={handleBatchChange}
                                    className="w-full pl-12 pr-10 py-4 bg-white border-2 border-gray-500 rounded-xl focus:outline-none focus:border-green-800 transition-all duration-300 text-lg text-black font-bold appearance-none cursor-pointer"
                                    required
                                >
                                    <option value="">ব্যাচ নির্বাচন করুন</option>
                                    {batches.map((batch) => (
                                        <option key={batch} value={batch}>
                                            {batch}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Other Batch Input (Conditional) */}
                        {showOtherBatch && (
                            <div ref={otherInputRef} className="overflow-hidden">
                                <label className="block text-black font-black mb-2 text-lg">
                                    অন্যান্য ব্যাচ লিখুন <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={otherBatch}
                                    onChange={(e) => setOtherBatch(e.target.value)}
                                    placeholder="Alumni / Guest / Teacher / Special"
                                    className="w-full px-4 py-4 bg-white border-2 border-gray-500 rounded-xl focus:outline-none focus:border-green-800 transition-all duration-300 text-lg text-black font-bold placeholder-gray-600"
                                    required={formData.batch === 'Others'}
                                />
                            </div>
                        )}

                        {/* Mobile */}
                        <div>
                            <label className="block text-black font-black mb-2 text-lg">
                                মোবাইল নম্বর <span className="text-red-600">*</span>
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-800 w-5 h-5" />
                                <input
                                    type="tel"
                                    value={formData.mobile}
                                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                    placeholder="01748269350"
                                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-500 rounded-xl focus:outline-none focus:border-green-800 transition-all duration-300 text-lg text-black font-bold placeholder-gray-600"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-black font-black mb-2 text-lg">
                                ইমেইল ঠিকানা <span className="text-red-600">*</span>
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-800 w-5 h-5" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="noor@email.com"
                                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-500 rounded-xl focus:outline-none focus:border-green-800 transition-all duration-300 text-lg text-black font-bold placeholder-gray-600"
                                    required
                                />
                            </div>
                        </div>

                        {/* Payment Method Selection */}
                        <div className="border-t-2 border-gray-300 pt-6">
                            <label className="block text-black font-black mb-4 text-xl">
                                💳 পেমেন্ট পদ্ধতি নির্বাচন করুন <span className="text-red-600">*</span>
                            </label>

                            <div className="space-y-4">
                                {/* Cash Payment Option */}
                                <div
                                    onClick={() => setFormData({ ...formData, paymentMethod: 'cash', paymentMedium: '', transactionId: '' })}
                                    className={`cursor-pointer p-5 rounded-xl border-2 transition-all duration-300 ${formData.paymentMethod === 'cash'
                                        ? 'border-emerald-600 bg-emerald-50 shadow-lg'
                                        : 'border-gray-300 bg-white hover:border-emerald-400'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === 'cash'
                                            ? 'border-emerald-600 bg-emerald-600'
                                            : 'border-gray-400'
                                            }`}>
                                            {formData.paymentMethod === 'cash' && (
                                                <div className="w-3 h-3 bg-white rounded-full"></div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-lg font-black text-black">🔘 কমিটিতে নগদ প্রদান</p>
                                            <p className="text-sm text-gray-600 font-medium mt-1">সরাসরি রেজিস্ট্রেশন সম্পন্ন করুন</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Online Payment Option */}
                                <div
                                    onClick={() => setFormData({ ...formData, paymentMethod: 'online' })}
                                    className={`cursor-pointer p-5 rounded-xl border-2 transition-all duration-300 ${formData.paymentMethod === 'online'
                                        ? 'border-blue-600 bg-blue-50 shadow-lg'
                                        : 'border-gray-300 bg-white hover:border-blue-400'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === 'online'
                                            ? 'border-blue-600 bg-blue-600'
                                            : 'border-gray-400'
                                            }`}>
                                            {formData.paymentMethod === 'online' && (
                                                <div className="w-3 h-3 bg-white rounded-full"></div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-lg font-black text-black">🔘 অনলাইন পেমেন্ট</p>
                                            <p className="text-sm text-gray-600 font-medium mt-1">বিকাশ বা নগদ এর মাধ্যমে</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Online Payment Details */}
                            {formData.paymentMethod === 'online' && (
                                <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-200 space-y-5">
                                    {/* Payment Medium Selection - First Step */}
                                    <div>
                                        <label className="block text-black font-black mb-3 text-lg">
                                            পেমেন্ট মাধ্যম নির্বাচন করুন <span className="text-red-600">*</span>
                                        </label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div
                                                onClick={() => setFormData({ ...formData, paymentMedium: 'bkash' })}
                                                className={`cursor-pointer p-4 rounded-xl border-2 text-center transition-all duration-300 ${formData.paymentMedium === 'bkash'
                                                    ? 'border-pink-600 bg-pink-100 shadow-lg'
                                                    : 'border-gray-300 bg-white hover:border-pink-400'
                                                    }`}
                                            >
                                                <p className="text-2xl mb-2">📱</p>
                                                <p className="font-black text-black">বিকাশ</p>
                                            </div>
                                            <div
                                                onClick={() => setFormData({ ...formData, paymentMedium: 'nagad' })}
                                                className={`cursor-pointer p-4 rounded-xl border-2 text-center transition-all duration-300 ${formData.paymentMedium === 'nagad'
                                                    ? 'border-orange-600 bg-orange-100 shadow-lg'
                                                    : 'border-gray-300 bg-white hover:border-orange-400'
                                                    }`}
                                            >
                                                <p className="text-2xl mb-2">💳</p>
                                                <p className="font-black text-black">নগদ</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Number Display - Shows based on selected medium */}
                                    {formData.paymentMedium && (
                                        <div className={`bg-white rounded-xl p-5 text-center border-2 ${formData.paymentMedium === 'bkash' ? 'border-pink-300' : 'border-orange-300'
                                            }`}>
                                            <p className="text-black font-bold text-lg mb-2">
                                                📱 পেমেন্ট নম্বর {formData.paymentMedium === 'bkash' ? '(বিকাশ)' : '(নগদ)'}
                                            </p>
                                            <div className="flex items-center justify-center gap-3">
                                                <p className={`text-3xl font-black ${formData.paymentMedium === 'bkash' ? 'text-pink-700' : 'text-orange-700'
                                                    }`}>
                                                    {formData.paymentMedium === 'bkash' ? '01748269350' : '01748269350'}
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={() => copyToClipboard(formData.paymentMedium === 'bkash' ? '01748269350' : '01748269350')}
                                                    className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95 ${formData.paymentMedium === 'bkash'
                                                        ? 'bg-pink-100 hover:bg-pink-200'
                                                        : 'bg-orange-100 hover:bg-orange-200'
                                                        }`}
                                                    title="নম্বর কপি করুন"
                                                >
                                                    <Copy className={`w-6 h-6 ${formData.paymentMedium === 'bkash' ? 'text-pink-700' : 'text-orange-700'
                                                        }`} />
                                                </button>
                                            </div>
                                            <p className="text-sm text-gray-600 font-medium mt-2">
                                                এই নম্বরে টাকা পাঠান
                                            </p>
                                        </div>
                                    )}

                                    {/* Transaction ID Input */}
                                    {formData.paymentMedium && (
                                        <div>
                                            <label className="block text-black font-black mb-2 text-lg">
                                                🧾 ট্রানজেকশন আইডি <span className="text-red-600">*</span>
                                            </label>
                                            <p className="text-sm text-gray-700 font-medium mb-3">
                                                অনুগ্রহ করে {formData.paymentMedium === 'bkash' ? '01748269350' : '01748269350'} নম্বরে টাকা পাঠিয়ে আপনার ট্রানজেকশন আইডি নিচে লিখুন
                                            </p>
                                            <input
                                                type="text"
                                                value={formData.transactionId}
                                                onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                                                placeholder="ট্রানজেকশন আইডি লিখুন"
                                                className="w-full px-4 py-4 bg-white border-2 border-gray-500 rounded-xl focus:outline-none focus:border-blue-600 transition-all duration-300 text-lg text-black font-bold placeholder-gray-600"
                                                required={formData.paymentMethod === 'online'}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Fee Display */}
                        <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-2xl p-6 text-center">
                            <p className="text-black text-lg mb-2 font-bold">রেজিস্ট্রেশন ফি</p>
                            <div className="flex flex-col items-center justify-center">
                                <p className="text-4xl font-black text-black">
                                    {formData.paymentMethod === 'online' ? '102' : '100'} টাকা
                                </p>
                                {formData.paymentMethod === 'online' && (
                                    <p className="text-sm text-gray-600 font-medium mt-1">
                                        (100 টাকা ফি + 2 টাকা চার্জ)
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-5 rounded-xl font-bold text-xl text-white transition-all duration-300 ${isLoading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-2xl hover:shadow-emerald-500/50 transform hover:scale-[1.02] active:scale-[0.98]'
                                }`}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-3">
                                    <span className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></span>
                                    অপেক্ষা করুন...
                                </span>
                            ) : (
                                '✅ রেজিস্ট্রেশন সম্পন্ন করুন'
                            )}
                        </button>

                        {/* Back Button */}
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="w-full py-4 rounded-xl font-semibold text-lg text-black bg-gray-200 hover:bg-gray-300 transition-all duration-300"
                        >
                            ← ফিরে যান
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};



export default PicnicRegisterPage;
