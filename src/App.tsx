import UserSearch from "./components/UserSearch";
import { Toaster } from "sonner";
const App = () => {
  return (
    <div className="container ">
      <h1 className="text">
        👨‍💻 Hello Chris — You’re a Software Engineer in the Making 🚀
      </h1>
      <UserSearch />
      <Toaster position="top-right" richColors />
    </div>
  );
};

export default App;
