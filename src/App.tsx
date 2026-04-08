import { useState, useMemo, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  XCircle, 
  Play, 
  RefreshCcw, 
  ShieldCheck, 
  Mail, 
  Lock, 
  AlertCircle,
  Check,
  ChevronRight,
  X
} from 'lucide-react';

// --- Pure Logic (The "Unit" part) ---
const VALID_EMAIL = "admin@gmail.com";
const VALID_PASSWORD = "password123";

const validateEmail = (email: string): boolean => {
  return email.includes('@');
};

const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

const performLogin = (email: string, password: string): boolean => {
  return email === VALID_EMAIL && password === VALID_PASSWORD;
};

// --- Test Cases ---
interface TestCase {
  id: number;
  name: string;
  description: string;
  run: () => boolean;
  expected: boolean;
}

const testCases: TestCase[] = [
  {
    id: 1,
    name: "Email Validation (Valid)",
    description: "Check if 'admin@gmail.com' is valid (contains @)",
    run: () => validateEmail("admin@gmail.com"),
    expected: true
  },
  {
    id: 2,
    name: "Email Validation (Invalid)",
    description: "Check if 'admin' is invalid (missing @)",
    run: () => validateEmail("admin"),
    expected: false
  },
  {
    id: 3,
    name: "Password Validation (Valid)",
    description: "Check if 'password123' is valid (>= 8 chars)",
    run: () => validatePassword("password123"),
    expected: true
  },
  {
    id: 4,
    name: "Password Validation (Invalid)",
    description: "Check if 'pass' is invalid (< 8 chars)",
    run: () => validatePassword("pass"),
    expected: false
  },
  {
    id: 5,
    name: "Login Success",
    description: "Correct email and password should succeed",
    run: () => performLogin("admin@gmail.com", "password123"),
    expected: true
  },
  {
    id: 6,
    name: "Login Failure (Wrong Password)",
    description: "Correct email but wrong password should fail",
    run: () => performLogin("admin@gmail.com", "wrongpass"),
    expected: false
  },
  {
    id: 7,
    name: "Login Failure (Wrong Email)",
    description: "Wrong email but correct password should fail",
    run: () => performLogin("wrong@gmail.com", "password123"),
    expected: false
  }
];

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginResult, setLoginResult] = useState<'idle' | 'success' | 'error'>('idle');
  
  const [testResults, setTestResults] = useState<{ id: number; passed: boolean }[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    // Simulate test execution delay for visual effect
    for (const test of testCases) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const result = test.run();
      setTestResults(prev => [...prev, { id: test.id, passed: result === test.expected }]);
    }
    
    setIsRunning(false);
  };

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (performLogin(email, password)) {
      setLoginResult('success');
    } else {
      setLoginResult('error');
    }
  };

  const stats = useMemo(() => {
    const passed = testResults.filter(r => r.passed).length;
    const failed = testResults.length - passed;
    const total = testCases.length;
    return { passed, failed, total, progress: (testResults.length / total) * 100 };
  }, [testResults]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-8 h-8 text-indigo-600" />
              Unit Test Demo
            </h1>
            <p className="text-slate-500 mt-1">Trang demo kiểm thử chức năng đăng nhập</p>
          </div>
          <button 
            onClick={runTests}
            disabled={isRunning}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-200 active:scale-95"
          >
            {isRunning ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
            Chạy Unit Test
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Interactive Form */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <ChevronRight className="w-5 h-5 text-indigo-500" />
                Form Đăng Nhập
              </h2>
              
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Email
                  </label>
                  <div className="relative group">
                    <input 
                      type="text" 
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setLoginResult('idle');
                      }}
                      placeholder="admin@gmail.com"
                      className="w-full px-4 py-3 pr-10 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-slate-50"
                    />
                    {email && (
                      <button
                        type="button"
                        onClick={() => {
                          setEmail('');
                          setLoginResult('idle');
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Lock className="w-4 h-4" /> Mật khẩu
                  </label>
                  <div className="relative group">
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setLoginResult('idle');
                      }}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 pr-10 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-slate-50"
                    />
                    {password && (
                      <button
                        type="button"
                        onClick={() => {
                          setPassword('');
                          setLoginResult('idle');
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-bold transition-all active:scale-[0.98]"
                >
                  Đăng Nhập
                </button>
              </form>

              <AnimatePresence mode="wait">
                {loginResult !== 'idle' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`mt-6 p-4 rounded-xl flex items-center gap-3 ${
                      loginResult === 'success' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                        : 'bg-rose-50 text-rose-700 border border-rose-100'
                    }`}
                  >
                    {loginResult === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <span className="font-medium">
                      {loginResult === 'success' ? 'Đăng nhập thành công!' : 'Email hoặc mật khẩu không đúng.'}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Validation Rules Card */}
            <div className="bg-indigo-900 text-white rounded-2xl p-8 shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <ShieldCheck className="w-32 h-32" />
              </div>
              <h3 className="text-lg font-bold mb-4 relative z-10">Quy tắc xác thực</h3>
              <ul className="space-y-3 text-indigo-100 relative z-10">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />
                  <span>Email phải chứa ký tự <b>@</b></span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />
                  <span>Mật khẩu phải có ít nhất <b>8 ký tự</b></span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />
                  <span>Tài khoản đúng: <b>admin@gmail.com</b> / <b>password123</b></span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right: Test Runner */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tổng số</p>
                <p className="text-3xl font-black text-slate-900">{testCases.length}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-1">Vượt qua</p>
                <p className="text-3xl font-black text-emerald-600">{stats.passed}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-1">Thất bại</p>
                <p className="text-3xl font-black text-rose-600">{stats.failed}</p>
              </div>
            </div>

            {/* Progress Bar */}
            {isRunning && (
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-indigo-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.progress}%` }}
                />
              </div>
            )}

            {/* Test Results Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Play className="w-4 h-4 text-indigo-500 fill-current" />
                  Kết Quả Kiểm Thử
                </h2>
                {testResults.length > 0 && !isRunning && (
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    stats.failed === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {stats.failed === 0 ? 'All Passed' : `${stats.failed} Failed`}
                  </span>
                )}
              </div>
              
              <div className="divide-y divide-slate-100">
                {testCases.map((test) => {
                  const result = testResults.find(r => r.id === test.id);
                  return (
                    <div key={test.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-slate-400">#{test.id.toString().padStart(2, '0')}</span>
                          <h3 className="font-bold text-slate-800">{test.name}</h3>
                        </div>
                        <p className="text-sm text-slate-500">{test.description}</p>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <AnimatePresence mode="wait">
                          {result ? (
                            <motion.div 
                              initial={{ scale: 0.5, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg font-bold text-sm ${
                                result.passed 
                                  ? 'bg-emerald-100 text-emerald-700' 
                                  : 'bg-rose-100 text-rose-700'
                              }`}
                            >
                              {result.passed ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                              {result.passed ? 'PASS' : 'FAIL'}
                            </motion.div>
                          ) : isRunning && testResults.length === test.id - 1 ? (
                            <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Pending</span>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  );
                })}
              </div>

              {testResults.length === 0 && !isRunning && (
                <div className="p-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                    <Play className="w-8 h-8 text-slate-300 fill-current" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-slate-600">Sẵn sàng chạy kiểm thử</p>
                    <p className="text-sm text-slate-400">Nhấn nút "Chạy Unit Test" để bắt đầu quá trình kiểm tra tự động.</p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="max-w-6xl mx-auto mt-12 pt-8 border-t border-slate-200 text-center text-slate-400 text-sm">
        <p>© 2026 Unit Test Demo • Built for Professional Quality Assurance</p>
      </footer>
    </div>
  );
}
