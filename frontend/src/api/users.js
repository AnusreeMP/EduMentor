import api from "./axios";

export const getAdminUsers = () => {
    return api.get("/admin/users/");
};

export const toggleUserStatus = (id, is_active) => {
    return api.patch(`/admin/users/${id}/`, {
        is_active: !is_active,
    });
};
