import { useNavigate } from "react-router-dom";
import "../CSS/Loading.css";

function Loading() {
  const navigate = useNavigate();
  setTimeout(() => {
    navigate("/dashboard");
  }, 3000);
  return (
    <div className="h-screen w-screen bg-gray-100">
      <div id="load">
        <div>G</div>
        <div>N</div>
        <div>I</div>
        <div>D</div>
        <div>A</div>
        <div>O</div>
        <div>L</div>
      </div>
    </div>
  );
}

export default Loading;
