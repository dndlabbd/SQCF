export const Login = ({ onLogin }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const password = event.target.elements.password.value;
    onLogin(password);
  };
  return (
    <div className="overflow-hidden">
      <div className="h-[100vh] w-full border-8 border-orange-200">
        <div className="lg:h-[90vh] h-[75vh] flex flex-col items-center justify-center mb-8">
          <div>
            <h1 className="text-4xl lg:mb-10 mb-4 font-bold text-orange-500">
              Art Insert Panel
            </h1>
          </div>
          <div>
            <form
              className="bg-orange-100 p-8 rounded-xl drop-shadow-md transform lg:scale-125 scale-100"
              onSubmit={handleSubmit}
            >
              <div className="my-2">
                <label className="pr-2">Password:</label>
                <input
                  className="bg-orange-200 rounded-sm"
                  name="password"
                  type="password"
                  required
                />
              </div>
              <div className="my-2">
                <button
                  className="p-2 mt-4 bg-orange-300 border border-black rounded-lg w-full"
                  type="submit"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
