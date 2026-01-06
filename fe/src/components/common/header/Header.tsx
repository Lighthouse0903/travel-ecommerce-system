import Header1 from "./Header1";
import Header2 from "./Header2";

const Header = () => {
  return (
    <div className="sticky z-[100] top-0 left-0 right-0 flex flex-col bg-card text-foreground border-b border-border">
      <Header1 />
      <div className="h-px bg-border" />
      <Header2 />
      <div className="h-px bg-border" />
    </div>
  );
};

export default Header;
