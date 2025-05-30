// export const Login = ({ onLogin }) => {
//   const handleSubmit = (event) => {
//     event.preventDefault();
//     const password = event.target.elements.password.value;
//     onLogin(password);
//   };
//   return (
//     <div className="overflow-hidden">
//       <div className="h-[100vh] w-full border-8 border-orange-200">
//         <div className="lg:h-[90vh] h-[75vh] flex flex-col items-center justify-center mb-8">
//           <div>
//             <h1 className="text-4xl lg:mb-10 mb-4 font-bold text-orange-500">
//               Art Insert Panel
//             </h1>
//           </div>
//           <div>
//             <form
//               className="bg-orange-100 p-8 rounded-xl drop-shadow-md transform lg:scale-125 scale-100"
//               onSubmit={handleSubmit}
//             >
//               <div className="my-2">
//                 <label className="pr-2">Password:</label>
//                 <input
//                   className="bg-orange-200 rounded-sm"
//                   name="password"
//                   type="password"
//                   required
//                 />
//               </div>
//               <div className="my-2">
//                 <button
//                   className="p-2 mt-4 bg-orange-300 border border-black rounded-lg w-full"
//                   type="submit"
//                 >
//                   Login
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };




export const Login = ({ onLogin }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const password = event.target.elements.password.value;
    onLogin(password);
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
      <div className="backdrop-blur-md bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/20 max-w-md w-full">
        <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-yellow-200 to-orange-300 text-4xl font-bold mb-10 text-center animate-fade-in">
          Admin Panel
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-gray-200 font-medium mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-4 py-3 bg-gray-800 text-white border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-orange-500/50 hover:scale-[1.02] active:scale-[0.98]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Login</span>
          </button>
        </form>
      </div>
    </div>
  );
};

