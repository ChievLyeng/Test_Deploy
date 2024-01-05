import TopAppBar from "./TopAppBar";

const Layout = ({ children }) => {
    return (
      <div>
        <nav>
          <TopAppBar />
        </nav>
        <main>{children}</main>
        <footer></footer>
      </div>
    );
  };
  
  export default Layout;