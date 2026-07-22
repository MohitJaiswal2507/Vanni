interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <div className="bg-[#F3EDE2] bg-radial from-[#F5F1E8] to-[#E1DCC9] flex min-h-screen flex-col items-center justify-center p-6 md:p-10 font-sans text-[#1F150C] selection:bg-[#412D15]/10 select-none">
      <div className="w-full max-w-sm md:max-w-3xl animate-fade-in">{children}</div>
    </div>
  );
};

export default Layout;
