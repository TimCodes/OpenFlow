import { Switch, Route } from "wouter";
import FlowEditor from "./pages/FlowEditor";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <>
      <Switch>
        <Route path="/" component={FlowEditor} />
        <Route>404 Page Not Found</Route>
      </Switch>
      <Toaster />
    </>
  );
}

export default App;
