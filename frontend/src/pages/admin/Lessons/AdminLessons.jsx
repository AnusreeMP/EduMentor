import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAdminLessons, deleteLesson } from "../../../api/lessons";

export default function AdminLessons() {
    const { moduleId } = useParams();
    const [lessons, setLessons] = useState([]);

    useEffect(() => {
        fetchLessons();
    }, []);

    const fetchLessons = async () => {
        const res = await getAdminLessons(moduleId);
        setLessons(res.data);
    };

    return (
        <div>
            <h2>Lessons</h2>

            <Link to="add">+ Add Lesson</Link>

            <table style={{ width: "100%", marginTop: "20px" }}>
                <thead>
                    <tr>
                        <th>Order</th>
                        <th>Title</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {lessons.map((lesson) => (
                        <tr key={lesson.id}>
                            <td>{lesson.order}</td>
                            <td>{lesson.title}</td>
                            <td>
                                <Link to={`edit/${lesson.id}`}>Edit</Link>{" "}
                                <button
                                    onClick={() => deleteLesson(lesson.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
