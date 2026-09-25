import { LoaderCircle } from "lucide-react";

function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="loading-state">
      <div className="loading-spinner">
        <LoaderCircle size={28} />
      </div>

      <p>{message}</p>
    </div>
  );
}

export default LoadingSpinner;