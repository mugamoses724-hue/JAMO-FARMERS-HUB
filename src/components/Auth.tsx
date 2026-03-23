import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, signInWithGoogle, RecaptchaVerifier, signInWithPhoneNumber } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../services/dataService';
import { motion } from 'motion/react';
import { UserPlus, LogIn, ShieldCheck, MapPin, Phone, CreditCard } from 'lucide-react';

export const Auth: React.FC = () => {
  const { user, profile, loading, refreshProfile } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPhoneLogin, setIsPhoneLogin] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [resendTimer, setResendTimer] = useState(0);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    nationalId: '',
    gender: 'Male' as const,
    region: 'Central',
    landSize: 0,
    farmingType: 'crop' as const,
  });
  const navigate = useNavigate();

  useEffect(() => {
    let interval: any;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleGoogleLogin = async () => {
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error('Login failed', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Login popup was closed before completion. Please try again.');
      } else if (err.code === 'auth/cancelled-by-user') {
        setError('Login was cancelled. Please try again.');
      } else {
        setError('An error occurred during login. Please try again.');
      }
    }
  };

  const setupRecaptcha = () => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': () => {
          // reCAPTCHA solved
        }
      });
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setupRecaptcha();
    const appVerifier = (window as any).recaptchaVerifier;
    try {
      const confirmation = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(confirmation);
      setIsOtpSent(true);
      setResendTimer(60);
    } catch (err: any) {
      console.error('SMS send failed', err);
      setError('Failed to send SMS. Please check the phone number format (e.g., +256...).');
      if ((window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier.clear();
        (window as any).recaptchaVerifier = null;
      }
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await confirmationResult.confirm(otp);
    } catch (err: any) {
      console.error('OTP verification failed', err);
      setError('Invalid OTP. Please try again.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const newProfile = {
      uid: user.uid,
      fullName: formData.fullName,
      phoneNumber: formData.phoneNumber,
      nationalId: formData.nationalId,
      gender: formData.gender,
      region: formData.region,
      role: 'farmer' as const,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
    };

    await dataService.createUserProfile(newProfile);
    
    // Create initial land record
    await dataService.createLandRecord({
      farmerUid: user.uid,
      size: formData.landSize,
      location: formData.region,
      farmingType: formData.farmingType,
      crops: [],
      status: 'pending',
      createdAt: new Date().toISOString(),
    });

    await refreshProfile();
    navigate('/dashboard');
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  if (user && !profile && !isRegistering) {
    return (
      <div className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-xl text-center">
        <h2 className="text-2xl font-bold mb-4">Welcome, {user.displayName}!</h2>
        <p className="text-black/60 mb-8">You haven't completed your farmer profile yet.</p>
        <button 
          onClick={() => setIsRegistering(true)}
          className="w-full bg-[#5A5A40] text-white py-4 rounded-2xl font-bold hover:bg-[#4A4A30] transition-all flex items-center justify-center gap-2"
        >
          <UserPlus size={20} />
          Complete Registration
        </button>
      </div>
    );
  }

  if (isRegistering) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-xl"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Farmer KYC Registration</h2>
        <form onSubmit={handleRegister} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider opacity-50">Full Name</label>
              <input 
                required
                className="w-full p-4 bg-black/5 rounded-2xl outline-none focus:ring-2 ring-[#5A5A40]/20"
                value={formData.fullName}
                onChange={e => setFormData({...formData, fullName: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider opacity-50">Phone Number</label>
              <input 
                required
                placeholder="+256..."
                className="w-full p-4 bg-black/5 rounded-2xl outline-none focus:ring-2 ring-[#5A5A40]/20"
                value={formData.phoneNumber}
                onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider opacity-50">National ID (NIN)</label>
              <input 
                required
                className="w-full p-4 bg-black/5 rounded-2xl outline-none focus:ring-2 ring-[#5A5A40]/20"
                value={formData.nationalId}
                onChange={e => setFormData({...formData, nationalId: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider opacity-50">Region</label>
              <select 
                className="w-full p-4 bg-black/5 rounded-2xl outline-none focus:ring-2 ring-[#5A5A40]/20"
                value={formData.region}
                onChange={e => setFormData({...formData, region: e.target.value})}
              >
                <option>Central</option>
                <option>Western</option>
                <option>Eastern</option>
                <option>Northern</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider opacity-50">Land Size (Acres)</label>
              <input 
                type="number"
                required
                className="w-full p-4 bg-black/5 rounded-2xl outline-none focus:ring-2 ring-[#5A5A40]/20"
                value={formData.landSize}
                onChange={e => setFormData({...formData, landSize: Number(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider opacity-50">Farming Type</label>
              <select 
                className="w-full p-4 bg-black/5 rounded-2xl outline-none focus:ring-2 ring-[#5A5A40]/20"
                value={formData.farmingType}
                onChange={e => setFormData({...formData, farmingType: e.target.value as any})}
              >
                <option value="crop">Crop Farming</option>
                <option value="livestock">Livestock</option>
                <option value="mixed">Mixed Farming</option>
              </select>
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              className="w-full bg-[#5A5A40] text-white py-4 rounded-2xl font-bold hover:bg-[#4A4A30] transition-all"
            >
              Submit for Verification
            </button>
          </div>
        </form>
      </motion.div>
    );
  }

  return (
    <div className="max-w-md mx-auto text-center py-12">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-black/5"
      >
        <img 
          src="https://storage.googleapis.com/static.antigravity.dev/0195c104-1834-7123-9689-181f08461539/logo.png" 
          className="w-32 h-32 mx-auto mb-6 object-contain" 
          alt="JAMO Logo" 
          referrerPolicy="no-referrer" 
        />
        <h1 className="text-4xl font-black mb-2 tracking-tight">JAMO</h1>
        <p className="text-black/40 mb-10 font-medium">Empowering Uganda's Farmers</p>
        
        <div id="recaptcha-container"></div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100">
            {error}
          </div>
        )}

        {isPhoneLogin ? (
          <div className="space-y-6">
            <form onSubmit={isOtpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4">
              <div className="space-y-4 text-left">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider opacity-50">Phone Number</label>
                  <input 
                    required
                    disabled={isOtpSent}
                    placeholder="+256..."
                    className={`w-full p-4 bg-black/5 rounded-2xl outline-none focus:ring-2 ring-[#5A5A40]/20 transition-all ${isOtpSent ? 'opacity-50 cursor-not-allowed' : ''}`}
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                  />
                </div>

                {isOtpSent && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-4"
                  >
                    <div className="p-3 bg-green-50 border border-green-100 rounded-xl flex items-center gap-2 text-green-700 text-xs font-bold">
                      <ShieldCheck size={16} />
                      Verification code sent to {phone}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider opacity-50">Enter 6-digit OTP</label>
                      <input 
                        required
                        maxLength={6}
                        placeholder="123456"
                        className="w-full p-4 bg-black/5 rounded-2xl outline-none focus:ring-2 ring-[#5A5A40]/20 text-center tracking-[1em] font-black text-xl"
                        value={otp}
                        onChange={e => setOtp(e.target.value)}
                      />
                    </div>
                  </motion.div>
                )}
              </div>

              {!isOtpSent ? (
                <button 
                  type="submit"
                  className="w-full bg-black text-white p-4 rounded-2xl font-bold hover:opacity-90 transition-all"
                >
                  Send OTP
                </button>
              ) : (
                <div className="space-y-4">
                  <button 
                    type="submit"
                    className="w-full bg-[#5A5A40] text-white p-4 rounded-2xl font-bold hover:bg-[#4A4A30] transition-all"
                  >
                    Verify OTP
                  </button>
                  <div className="flex flex-col items-center gap-2">
                    <button 
                      type="button"
                      disabled={resendTimer > 0}
                      onClick={handleSendOtp}
                      className={`text-xs font-bold transition-all ${resendTimer > 0 ? 'text-black/20 cursor-not-allowed' : 'text-[#5A5A40] hover:underline'}`}
                    >
                      {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
                    </button>
                    <button 
                      type="button"
                      onClick={() => {
                        setIsOtpSent(false);
                        setOtp('');
                      }}
                      className="text-xs font-bold text-black/40 hover:text-black transition-all"
                    >
                      Change Phone Number
                    </button>
                  </div>
                </div>
              )}
            </form>
            
            <button 
              onClick={() => {
                setIsPhoneLogin(false);
                setIsOtpSent(false);
                setOtp('');
              }}
              className="text-sm font-bold text-[#5A5A40] hover:underline"
            >
              Back to other options
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <button 
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-black/5 p-4 rounded-2xl font-bold hover:bg-black/5 transition-all"
            >
              <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
              Continue with Google
            </button>
            
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-black/5"></div></div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold text-black/20 bg-white px-4">Or</div>
            </div>

            <button 
              onClick={() => setIsPhoneLogin(true)}
              className="w-full bg-black text-white p-4 rounded-2xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              <Phone size={20} />
              Phone Number Login
            </button>
          </div>
        )}

        <p className="mt-8 text-xs text-black/40 px-4">
          By continuing, you agree to JAMO's Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
};
