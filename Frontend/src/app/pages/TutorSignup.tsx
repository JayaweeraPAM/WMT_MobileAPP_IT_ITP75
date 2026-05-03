import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { useTutorOnboarding } from '../contexts/TutorOnboardingContext';
import { useTheme } from '../contexts/ThemeContext';
import { StepProgressIndicator } from '../components/StepProgressIndicator';
import { toast } from 'sonner';
import { GraduationCap, Eye, EyeOff, ArrowRight, Shield, Star } from 'lucide-react';

const STEPS = [
  { number: 1, label: 'Account' },
  { number: 2, label: 'Basic Info' },
  { number: 3, label: 'Subjects & Qualifications' },
];

export function TutorSignup() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { data, setData } = useTutorOnboarding();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!data.name.trim()) newErrors.name = 'Full Name is required';
    if (!data.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) newErrors.email = 'Please enter a valid email';
    if (!data.password) newErrors.password = 'Password is required';
    else if (data.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setData({
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password,
    });
    navigate('/tutor/signup-step2');
  };

  const card = isDark ? 'bg-white/5 border-white/10' : 'border';
  const cardStyle = isDark
    ? {}
    : { background: '#edeaf8', borderColor: '#a8a4c6', boxShadow: '0 4px 24px rgba(60,50,140,0.14)' };

  const textPrimary = isDark ? 'text-white' : 'text-[#0f0e1a]';
  const textSub     = isDark ? 'text-white/60' : 'text-[#555292]';
  const textLabel   = isDark ? 'text-white/90' : 'text-[#2d2a50]';
  const textLink    = isDark ? 'text-white/60' : 'text-[#555292]';
  const textBack    = isDark ? 'text-white/50' : 'text-[#6665a0]';
  const iconBtn     = isDark ? 'text-white/50 hover:text-white/90' : 'text-[#6665a0] hover:text-[#0f0e1a]';
  const inputClass  = isDark
    ? 'h-12 border-white/10 text-white dark:placeholder:text-white/50 rounded-xl'
    : 'h-12 text-[#0f0e1a] rounded-xl';
  const inputStyle  = isDark ? {} : { background: '#eeebf5', borderColor: '#a8a4c6', color: '#0f0e1a' };

  const wrapBg = isDark
    ? { background: 'rgba(6,4,15,0.5)' }
    : { background: 'transparent' };

  return (
    <div className="min-h-screen flex page-enter" style={wrapBg}>
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12"
        style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #6C63FF 50%, #3B82F6 100%)' }}>
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 60% 30%, white 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
        <div className="relative z-10 text-white text-center max-w-md">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-4 text-white">Teach with Us</h2>
          <p className="text-xl text-white/80 mb-8">Reach more students and grow your teaching career from anywhere.</p>
          <div className="space-y-4">
            {['Set your own pricing & schedule', 'Get paid securely & on time', 'Build your professional tutor profile', 'Reach thousands of students across Sri Lanka'].map((feat) => (
              <div key={feat} className="flex items-center gap-3 text-left bg-white/10 rounded-xl px-4 py-3">
                <Star className="w-5 h-5 text-yellow-300 fill-yellow-300 flex-shrink-0" />
                <span className="text-white/90">{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center gap-2 mb-6 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#6C63FF] flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#7C3AED] to-[#6C63FF] bg-clip-text text-transparent">TutorHub</span>
          </div>

          <div className="mb-4">
            <StepProgressIndicator currentStep={1} steps={STEPS} />
          </div>

          <div className={`backdrop-blur-lg rounded-3xl shadow-2xl p-8 border ${card}`} style={cardStyle}>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-[#7C3AED]" />
                <span className="text-sm font-semibold text-[#7C3AED] uppercase tracking-wide">Tutor Registration</span>
              </div>
              <h1 className={`text-3xl font-bold mb-2 ${textPrimary}`}>Sign Up</h1>
              <p className={textSub}>Create your tutor account to start teaching</p>
            </div>

            <form onSubmit={handleNext} className="space-y-5">
              <div className="space-y-2">
                <Label className={`${textLabel} font-medium`}>Full Name</Label>
                <Input
                  id="name"
                  placeholder="Your full name"
                  value={data.name}
                  onChange={(e) => setData({ name: e.target.value })}
                  required
                  className={`${inputClass} ${errors.name ? 'border-red-500' : ''}`}
                  style={inputStyle}
                />
                {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label className={`${textLabel} font-medium`}>Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tutor@example.com"
                  value={data.email}
                  onChange={(e) => setData({ email: e.target.value })}
                  required
                  className={`${inputClass} ${errors.email ? 'border-red-500' : ''}`}
                  style={inputStyle}
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label className={`${textLabel} font-medium`}>Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 6 characters"
                    value={data.password}
                    onChange={(e) => setData({ password: e.target.value })}
                    required
                    className={`${inputClass} pr-12 ${errors.password ? 'border-red-500' : ''}`}
                    style={inputStyle}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${iconBtn}`}>
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
              </div>

              <Button type="submit"
                className="w-full h-12 rounded-xl text-base font-semibold text-white border-0 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #6C63FF)' }}>
                <span className="flex items-center gap-2 justify-center">Register as Tutor <ArrowRight className="w-4 h-4" /></span>
              </Button>
            </form>

            <div className="mt-6 text-center space-y-3">
              <p className={`${textLink} text-sm`}>
                Already have an account?{' '}
                <Link to="/tutor/login" className="font-semibold text-[#7C3AED] hover:underline">Login here</Link>
              </p>
              <p className={`${textBack} text-sm`}>
                Looking to learn?{' '}
                <Link to="/student/signup" className="text-[#3B82F6] hover:underline">Student Signup</Link>
              </p>
            </div>
          </div>
          <p className={`text-center mt-4 text-sm ${textBack}`}>
            <Link to="/" className="hover:text-[#6C63FF] transition-colors">← Back to Home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
