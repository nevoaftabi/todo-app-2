import { useNavigate } from "react-router";
import { useAuth } from './AuthProvider';

export default function LoginButton() {
    const { logout } = useAuth();
    const nav = useNavigate();

    return (
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          onClick={async () => {
            await logout();
            nav("/login", { replace: true })
          }}
          >
            Log out
        </button>
    )
}

