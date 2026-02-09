import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Mail, User, GraduationCap, Phone, Building2, DollarSign } from 'lucide-react';
import confetti from 'canvas-confetti';

const PicnicSuccessPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const registration = location.state?.registration;
    const cardRef = useRef(null);
    const checkRef = useRef(null);

    useEffect(() => {
        if (!registration) {
            navigate('/');
            return;
        }

        // Confetti animation
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                colors: ['#10b981', '#14b8a6', '#06b6d4']
            }));
            confetti(Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                colors: ['#10b981', '#14b8a6', '#06b6d4']
            }));
        }, 250);



        return () => clearInterval(interval);
    }, [registration, navigate]);

    if (!registration) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-12 px-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-green-200 to-emerald-300 rounded-full opacity-20 blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-teal-200 to-cyan-300 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="relative z-10 max-w-3xl mx-auto">
                {/* Success Card */}
                <div ref={cardRef} className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-emerald-100">
                    {/* Success Header */}
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-12 text-center text-white relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-5 left-10 w-20 h-20 bg-white rounded-full blur-xl"></div>
                            <div className="absolute bottom-5 right-10 w-24 h-24 bg-white rounded-full blur-xl"></div>
                        </div>
                        <div ref={checkRef} className="relative inline-block mb-4">
                            <CheckCircle className="w-24 h-24 text-white drop-shadow-2xl" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-3">
                            🎉 রেজিস্ট্রেশন সফল হয়েছে! 🎉
                        </h1>
                        <p className="text-xl text-emerald-100">
                            ইফতার পার্টি – ২০২৬ | ICE Department
                        </p>
                    </div>

                    {/* Registration Details */}
                    <div className="p-8 md:p-12">
                        <div className="mb-8">
                            <h2 className="text-2xl font-black text-black mb-6 text-center">
                                আপনার রেজিস্ট্রেশন তথ্য
                            </h2>

                            <div className="space-y-4">
                                <div className="info-row flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl">
                                    <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                                        <User className="w-6 h-6 text-emerald-700" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-black font-bold">নাম</p>
                                        <p className="text-lg font-black text-black">{registration.name}</p>
                                    </div>
                                </div>

                                <div className="info-row flex items-center gap-4 p-4 bg-white border border-gray-400 rounded-xl">
                                    <div className="flex-shrink-0 w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                                        <Building2 className="w-6 h-6 text-teal-800" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-black font-bold">ডিপার্টমেন্ট</p>
                                        <p className="text-lg font-black text-black">{registration.department}</p>
                                    </div>
                                </div>

                                <div className="info-row flex items-center gap-4 p-4 bg-white border border-gray-400 rounded-xl">
                                    <div className="flex-shrink-0 w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
                                        <GraduationCap className="w-6 h-6 text-cyan-800" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-black font-bold">ব্যাচ</p>
                                        <p className="text-lg font-black text-black">{registration.batch}</p>
                                    </div>
                                </div>

                                <div className="info-row flex items-center gap-4 p-4 bg-white border border-gray-400 rounded-xl">
                                    <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                        <Phone className="w-6 h-6 text-purple-800" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-black font-bold">মোবাইল</p>
                                        <p className="text-lg font-black text-black">{registration.mobile}</p>
                                    </div>
                                </div>

                                <div className="info-row flex items-center gap-4 p-4 bg-white border border-gray-400 rounded-xl">
                                    <div className="flex-shrink-0 w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                                        <Mail className="w-6 h-6 text-pink-800" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-black font-bold">ইমেইল</p>
                                        <p className="text-lg font-black text-black">{registration.email}</p>
                                    </div>
                                </div>

                                <div className="info-row flex items-center gap-4 p-4 bg-white rounded-xl border-2 border-green-500">
                                    <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                        <DollarSign className="w-6 h-6 text-green-800" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-black font-bold">পেমেন্ট পদ্ধতি</p>
                                        <p className="text-lg font-black text-black">
                                            {registration.paymentMethod === 'cash' ? '💵 কমিটিতে নগদ প্রদান' : '💳 অনলাইন পেমেন্ট'}
                                        </p>
                                    </div>
                                </div>

                                {registration.paymentMethod === 'online' && (
                                    <>
                                        <div className="info-row flex items-center gap-4 p-4 bg-white border border-gray-400 rounded-xl">
                                            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                                <Phone className="w-6 h-6 text-blue-800" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-black font-bold">পেমেন্ট মাধ্যম</p>
                                                <p className="text-lg font-black text-black">
                                                    {registration.paymentMedium === 'bkash' ? '📱 বিকাশ' : '💳 নগদ'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="info-row flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-400 rounded-xl">
                                            <div className="flex-shrink-0 w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                                                <CheckCircle className="w-6 h-6 text-blue-800" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-black font-bold">ট্রানজেকশন আইডি</p>
                                                <p className="text-lg font-black text-blue-700">{registration.transactionId}</p>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {registration.paymentMethod === 'cash' && (
                                    <div className="info-row flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-400 rounded-xl">
                                        <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                            <CheckCircle className="w-6 h-6 text-gray-700" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-black font-bold">ট্রানজেকশন আইডি</p>
                                            <p className="text-lg font-black text-gray-600">প্রযোজ্য নয়</p>
                                        </div>
                                    </div>
                                )}

                                <div className="info-row flex items-center gap-4 p-4 bg-white rounded-xl border-2 border-green-500">
                                    <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                        <DollarSign className="w-6 h-6 text-green-800" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-black font-bold">রেজিস্ট্রেশন ফি</p>
                                        <p className="text-2xl font-black text-black">১৫০ টাকা</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Email Notification */}
                        <div className="bg-blue-50 rounded-2xl p-6 mb-6 border border-blue-200">
                            <div className="flex items-start gap-4">
                                <Mail className="w-6 h-6 text-blue-700 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-2">📧 ইমেইল নিশ্চিতকরণ</h3>
                                    <p className="text-gray-800 leading-relaxed font-medium">
                                        খুব শীঘ্রই পেমেন্ট সংক্রান্ত আপডেট ইমেইলে জানানো হবে।
                                        আপনার ইনবক্স এবং স্প্যাম ফোল্ডার চেক করুন।
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Success Message */}
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-8 text-center text-white mb-6">
                            <p className="text-xl md:text-2xl font-bold leading-relaxed">
                                আমরা ইফতার পার্টি – ২০২৬ এ<br />
                                আপনাকে স্বাগতম জানাচ্ছি! 🌿
                            </p>
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={() => navigate('/')}
                            className="w-full py-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xl font-bold rounded-xl hover:shadow-2xl hover:shadow-emerald-500/50 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                        >
                            হোম পেজে ফিরে যান
                        </button>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="text-center mt-8 text-black font-bold">
                    <p className="text-lg">
                        ধন্যবাদ 🌸<br />
                        <span className="font-semibold">ICE Department Team</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PicnicSuccessPage;
