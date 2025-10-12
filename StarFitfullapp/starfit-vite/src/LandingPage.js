import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white font-sans">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-pink-400 text-3xl">★</span>
            <span className="text-white text-2xl font-bold tracking-tight">StarFit</span>
          </Link>
          
          <nav className="hidden md:flex gap-8 text-base font-medium">
            <a href="#features" className="hover:text-pink-400 transition">Features</a>
            <a href="#plans" className="hover:text-pink-400 transition">Plans</a>
            <a href="#testimonials" className="hover:text-pink-400 transition">Testimonials</a>
            <a href="#contact" className="hover:text-pink-400 transition">Contact</a>
          </nav>
          
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-white hover:text-pink-400 transition font-semibold">
              Sign In
            </Link>
            <Link 
              to="/register" 
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            Transform Your Gym<br />
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-teal-300 bg-clip-text text-transparent">
              Management Experience
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-gray-200 max-w-3xl mx-auto">
            The complete platform for gym owners and fitness enthusiasts. Track members, manage workouts, and grow your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/register/manager" 
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-bold shadow-2xl hover:shadow-pink-500/50 hover:scale-105 transition"
            >
              Start as Manager
            </Link>
            <Link 
              to="/register" 
              className="bg-white text-purple-900 px-8 py-4 rounded-full text-lg font-bold shadow-2xl hover:shadow-white/50 hover:scale-105 transition"
            >
              Join as Member
            </Link>
          </div>
          <p className="mt-8 text-gray-300 text-sm">
            ✨ Free 30-day trial • No credit card required
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Everything You Need to <span className="text-pink-400">Succeed</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-pink-400/50 transition">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-2xl font-bold mb-3">Analytics Dashboard</h3>
              <p className="text-gray-300">
                Real-time insights into revenue, member growth, attendance patterns, and performance metrics.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-purple-400/50 transition">
              <div className="text-5xl mb-4">💪</div>
              <h3 className="text-2xl font-bold mb-3">Workout Management</h3>
              <p className="text-gray-300">
                Create custom routines, track progress, and help members achieve their fitness goals.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-teal-400/50 transition">
              <div className="text-5xl mb-4">👥</div>
              <h3 className="text-2xl font-bold mb-3">Member Management</h3>
              <p className="text-gray-300">
                Manage subscriptions, track payments, and connect managers with their clients seamlessly.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-yellow-400/50 transition">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-2xl font-bold mb-3">Secure & Private</h3>
              <p className="text-gray-300">
                Enterprise-grade security with encrypted passwords, JWT authentication, and role-based access.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-green-400/50 transition">
              <div className="text-5xl mb-4">📱</div>
              <h3 className="text-2xl font-bold mb-3">Mobile Friendly</h3>
              <p className="text-gray-300">
                Access your dashboard and workouts from any device, anywhere, anytime.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-blue-400/50 transition">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold mb-3">Lightning Fast</h3>
              <p className="text-gray-300">
                Built with modern tech stack for optimal performance and seamless user experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="plans" className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-16">
            Choose Your <span className="text-teal-400">Perfect Plan</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Plan 1 */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 hover:border-teal-500 transition">
              <h3 className="text-2xl font-bold mb-4">Plano Fit</h3>
              <p className="text-5xl font-bold mb-6">$99<span className="text-xl text-gray-400">/mo</span></p>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <span className="text-teal-400">✓</span> Access to gym equipment
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-teal-400">✓</span> Group classes
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-teal-400">✓</span> Workout tracking
                </li>
              </ul>
              <Link to="/register" className="block bg-teal-600 text-white py-3 rounded-full font-bold hover:bg-teal-700 transition">
                Get Started
              </Link>
            </div>

            {/* Plan 2 - Featured */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-8 border-2 border-white transform scale-105 shadow-2xl">
              <div className="bg-yellow-400 text-purple-900 text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                MOST POPULAR
              </div>
              <h3 className="text-2xl font-bold mb-4">Plano Gold</h3>
              <p className="text-5xl font-bold mb-6">$149<span className="text-xl text-pink-200">/mo</span></p>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <span className="text-white">✓</span> Everything in Fit
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-white">✓</span> Personal trainer sessions
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-white">✓</span> Nutrition guidance
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-white">✓</span> Priority support
                </li>
              </ul>
              <Link to="/register" className="block bg-white text-purple-900 py-3 rounded-full font-bold hover:bg-gray-100 transition">
                Get Started
              </Link>
            </div>

            {/* Plan 3 */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 hover:border-purple-500 transition">
              <h3 className="text-2xl font-bold mb-4">Plano Premium</h3>
              <p className="text-5xl font-bold mb-6">$199<span className="text-xl text-gray-400">/mo</span></p>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <span className="text-purple-400">✓</span> Everything in Gold
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-400">✓</span> Unlimited PT sessions
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-400">✓</span> Spa & massage access
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-400">✓</span> VIP locker room
                </li>
              </ul>
              <Link to="/register" className="block bg-purple-600 text-white py-3 rounded-full font-bold hover:bg-purple-700 transition">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-6 bg-black/20">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-16">
            What Our <span className="text-pink-400">Members Say</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="text-yellow-400 text-2xl mb-4">★★★★★</div>
              <p className="text-gray-200 mb-4 italic">
                "StarFit transformed how I manage my gym. The analytics are incredible!"
              </p>
              <p className="font-bold">— Sarah J., Gym Owner</p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="text-yellow-400 text-2xl mb-4">★★★★★</div>
              <p className="text-gray-200 mb-4 italic">
                "Best fitness tracking app I've ever used. Simple and powerful."
              </p>
              <p className="font-bold">— Mike T., Member</p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="text-yellow-400 text-2xl mb-4">★★★★★</div>
              <p className="text-gray-200 mb-4 italic">
                "The manager-client connection feature is a game changer for personal trainers."
              </p>
              <p className="font-bold">— Alex R., Personal Trainer</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 shadow-2xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Fitness Journey?
          </h2>
          <p className="text-xl mb-8 text-gray-100">
            Join thousands of gym owners and fitness enthusiasts already using StarFit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="bg-white text-purple-900 px-8 py-4 rounded-full text-lg font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition"
            >
              Start Free Trial
            </Link>
            <Link 
              to="/login" 
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-white hover:text-purple-900 transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-black/40 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-pink-400 text-3xl">★</span>
            <span className="text-white text-2xl font-bold">StarFit</span>
          </div>
          <p className="text-gray-400 mb-4">
            © 2025 StarFit. All rights reserved.
          </p>
          <div className="flex justify-center gap-6 text-gray-400">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
            <a href="#contact" className="hover:text-white transition">Contact Us</a>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default LandingPage;
