import Header1 from "./Header1";
import Header2 from "./Header2";

const Header = () => {
  return (
    <div className="sticky z-[100] top-0 right-0 left-0 flex flex-col text-gray-700 bg-slate-200">
      <Header1 />
      <div className="h-px bg-gradient-to-r from-transparent via-gray-500/50 to-transparent" />
      <Header2 />
      <div className="h-px bg-gradient-to-r from-transparent via-gray-500/50 to-transparent" />
    </div>
  );
};

export default Header;
