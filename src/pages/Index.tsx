import { Navigate } from "react-router-dom";

// Redirect to Home for backwards compatibility
const Index = () => <Navigate to="/" replace />;

export default Index;
