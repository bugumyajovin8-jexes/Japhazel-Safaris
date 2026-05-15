import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
// import { TooltipProvider } from "@/components/ui/tooltip"; // Commenting out to avoid React version conflict
import { StoreProvider } from "@/lib/store";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Tours from "@/pages/Tours";
import TourDetails from "@/pages/TourDetails";
import Admin from "@/pages/Admin";
import About from "@/pages/About";
import Gallery from "@/pages/Gallery";
import Contact from "@/pages/Contact";
import Blog from "@/pages/Blog";
import Planning from "@/pages/Planning";
import Booking from "@/pages/Booking";
import Login from "@/pages/Login";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/tours" component={Tours} />
      <Route path="/tours/:id" component={TourDetails} />
      
      {/* Protected Admin Route */}
      <Route path="/admin">
        <ProtectedRoute component={Admin} />
      </Route>

      <Route path="/login" component={Login} />
      <Route path="/destinations" component={Tours} />
      <Route path="/about" component={About} />
      <Route path="/gallery" component={Gallery} />
      <Route path="/contact" component={Contact} />
      <Route path="/blog" component={Blog} />
      <Route path="/planning" component={Planning} />
      <Route path="/booking" component={Booking} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        {/* <TooltipProvider> */}
          <Toaster />
          <Router />
        {/* </TooltipProvider> */}
      </StoreProvider>
    </QueryClientProvider>
  );
}

export default App;
