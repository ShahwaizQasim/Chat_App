import { useState } from "react";
import {
  Eye,
  EyeOff,
  MessageCircle,
  User,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AppRoutes } from "../../../constant/AppRoutes";
import { showToast } from "../../../components/SweerAlert2/alert";

export default function AuthForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const obj = {
        userName: formData.name,
        email: formData.email,
        password: formData.password,
      };
      setIsLoading(true);
      const response = await axios({
        method: "POST",
        url: AppRoutes.signup,
        data: obj,
        headers: {
          "Content-Type": "application/json",
        },
      });
      if(response?.data?.status === 200){
        showToast("Signup Successfully", "success");
        navigate("/login");
      }

      console.log("Signup attempt:", response);
        setFormData({
      name: "",
      email: "",
      password: "",
    });
    } catch (error) {
      if(error?.response?.data?.msg){
        showToast(error?.response?.data?.msg, "error");
      } else {
        showToast("Something went wrong", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          >
            <Sparkles className="w-4 h-4 text-white opacity-30" />
          </div>
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Glass Card */}
          <div className="backdrop-blur-2xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8 transition-all duration-300 hover:bg-white/15">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="relative inline-block mb-6">
                <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-4 rounded-2xl shadow-lg">
                  <MessageCircle className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce"></div>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-3">
                ChatApp
              </h1>
              <p className="text-white/70 text-lg">Join the conversation!</p>
            </div>

            {/* Form */}
            <div >
            <form onSubmit={handleSignUp} className="space-y-6">

              <div className="group">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 h-5 w-5 group-focus-within:text-purple-300 transition-colors" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Full Name"
                    className="w-full pl-14 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all text-white placeholder-white/50 hover:bg-white/15"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="group">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 h-5 w-5 group-focus-within:text-purple-300 transition-colors" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email Address"
                    className="w-full pl-14 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all text-white placeholder-white/50 hover:bg-white/15"
                    required
                  />
                </div>
              </div>
              <div className="group">
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 h-5 w-5 group-focus-within:text-purple-300 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                    className="w-full pl-14 pr-14 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all text-white placeholder-white/50 hover:bg-white/15"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-purple-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="text-right">
                <a
                  href="#"
                  className="text-purple-300 hover:text-purple-200 transition-colors text-sm"
                >
                  Forgot Password? 🔑
                </a>
              </div>

              {/* Submit Button */}
              <button
                disabled={isLoading}
                type="submit"
                className="w-full relative bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    Create Account
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </button>
            </form>

            </div>

            {/* Toggle Form */}
            <div className="mt-8 text-center">
              <p className="text-white/70 mb-4 flex gap-2 justify-center">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-light hover:text-light font-semibold transition-colors"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
