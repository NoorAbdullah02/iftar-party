import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Mail, GraduationCap, Building2, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const PicnicRegisterPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        department: 'ICE',
        batch: '',
        mobile: '',
        email: ''
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
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            const finalBatch = formData.batch === 'Others' ? otherBatch : formData.batch;

            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/picnic/register`, {
                ...formData,
                batch: finalBatch
            });

            if (response.data.success) {
                toast.success('🎉 রেজিস্ট্রেশন সফল হয়েছে!');

                // Navigate to success page with data
                navigate('/picnic-success', {
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
                        🌸 রেজিস্ট্রেশন ফর্ম 🌸
                    </h1>
                    <p className="text-xl text-black font-bold">চড়ুইভাতি – ২০২৬ | ICE Department</p>
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
                                    placeholder="01XXXXXXXXX"
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
                                    placeholder="example@email.com"
                                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-500 rounded-xl focus:outline-none focus:border-green-800 transition-all duration-300 text-lg text-black font-bold placeholder-gray-600"
                                    required
                                />
                            </div>
                        </div>

                        {/* Fee Display */}
                        <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-2xl p-6 text-center">
                            <p className="text-black text-lg mb-2 font-bold">রেজিস্ট্রেশন ফি</p>
                            <p className="text-4xl font-black text-black">৪৫০ টাকা</p>
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
