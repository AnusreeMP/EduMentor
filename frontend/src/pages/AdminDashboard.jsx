import { Link } from "react-router-dom";

export default function Dashboard() {
    return (
        <div className="container py-5">
            <h2 className="fw-bold mb-4">👋 Welcome to EduMentor</h2>

            <div className="row">
                <div className="col-md-4 mb-3">
                    <Link to="/courses" className="btn btn-primary w-100 p-4">
                        📚 Browse Courses
                    </Link>
                </div>

                <div className="col-md-4 mb-3">
                    <Link to="/my-courses" className="btn btn-outline-primary w-100 p-4">
                        🎓 My Courses
                    </Link>
                </div>

                <div className="col-md-4 mb-3">
                    <Link to="/profile" className="btn btn-outline-secondary w-100 p-4">
                        👤 Profile
                    </Link>
                </div>
            </div>
        </div>
    );
}
