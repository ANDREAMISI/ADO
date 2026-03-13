import { usePage } from "@inertiajs/react";

export function usePermissions() {
    const { auth } = usePage().props;
    const user = auth?.user;
    const roles = user?.roles || [];

    // Debug: vérifier les rôles reçus (à supprimer en production)
    console.log("[Permissions] User:", user?.name, "Roles:", roles);

    const hasRole = (role) => roles.includes(role);
    const hasAnyRole = (roleList) =>
        roleList.some((role) => roles.includes(role));

    const isAdmin = hasRole("admin");
    const isContributor = hasRole("contributor");
    const isReader = hasRole("reader");

    // Permissions basées sur les rôles
    const can = {
        // Documents - Permissions pour viewHistory
        viewDocuments: true,
        uploadDocuments: isAdmin || isContributor,
        editOwnDocuments: isAdmin || isContributor,
        editAllDocuments: isAdmin,
        deleteOwnDocuments: isAdmin || isContributor,
        deleteAllDocuments: isAdmin,
        downloadDocuments: true,
        // Modifier pour permettre à tous les utilisateurs connectés de voir l'historique
        viewHistory: user ? true : false, // Tous les utilisateurs connectés

        // Catégories
        viewCategories: true,
        createCategories: isAdmin,
        editCategories: isAdmin,
        deleteCategories: isAdmin,
        manageCategories: isAdmin,

        // Tags
        viewTags: true,
        createTags: isAdmin || isContributor,
        editTags: isAdmin || isContributor,
        deleteTags: isAdmin || isContributor,

        // Administration
        viewUsers: isAdmin,
        manageUsers: isAdmin,
        viewLogs: isAdmin,
        viewStats: isAdmin,
    };

    return {
        user,
        roles,
        isAdmin,
        isContributor,
        isReader,
        hasRole,
        hasAnyRole,
        can,
    };
}
