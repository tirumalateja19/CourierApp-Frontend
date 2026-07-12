import { Link } from "react-router";

const Landing = () => {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center gap-6 bg-gray-100">
      <h1 className="text-3xl font-serif text-black">PickItUp</h1>
      <div className="flex gap-4">
        <Link
          to="/admin/login"
          className="px-6 py-3 rounded-xl bg-black text-white font-semibold hover:bg-gray-800 transition"
        >
          Admin
        </Link>
        <Link
          to="/partner/login"
          className="px-6 py-3 rounded-xl bg-black text-white font-semibold hover:bg-gray-800 transition"
        >
          Partner
        </Link>
      </div>
    </div>
  );
};

export default Landing;
