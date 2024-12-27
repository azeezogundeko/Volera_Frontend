const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex-1 bg-white dark:bg-[#111111]">
      {children}
    </main>
  );
};

export default Layout;
