const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="bg-white dark:bg-[#111111] min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col max-w-[1200px] mx-auto w-full">
        {children}
      </div>
    </main>
  );
};

export default Layout;
