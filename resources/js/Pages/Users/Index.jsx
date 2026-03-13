// resources/js/Pages/Users/Index.jsx
import React, { useState, useEffect } from "react";
import { Link, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/Roles/AdminLayout";
import { usePermissions } from "@/Hooks/usePermissions";
import axios from "@/Services/axios";
import {
    Users,
    UserPlus,
    Edit2,
    Trash2,
    Shield,
    Mail,
    Calendar,
    Search,
    MoreVertical,
    CheckCircle,
    XCircle,
    RefreshCw,
    X,
    Filter,
    SlidersHorizontal,
} from "lucide-react";

export default function UsersIndex() {
    const { user: currentUser } = usePermissions();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    // Filtres
    const [filters, setFilters] = useState({
        role: "",
        is_active: "",
        date: "",
        sort_by: "created_at",
        sort_order: "desc",
    });

    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0,
    });

    // Effet pour la recherche en temps réel (debounce)
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    // Charger les utilisateurs quand les filtres changent
    useEffect(() => {
        fetchUsers(1);
    }, [debouncedSearch, filters]);

    const fetchUsers = async (page = 1) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();

            // Recherche
            if (debouncedSearch) params.append("search", debouncedSearch);

            // Filtres
            if (filters.role) params.append("role", filters.role);
            if (filters.is_active !== "")
                params.append("is_active", filters.is_active);
            if (filters.date) params.append("date", filters.date);
            if (filters.sort_by) params.append("sort_by", filters.sort_by);
            if (filters.sort_order)
                params.append("sort_order", filters.sort_order);

            params.append("page", page);

            const response = await axios.get(
                `/web-api/users?${params.toString()}`,
            );

            setUsers(response.data.data || []);
            setPagination(
                response.data.meta || {
                    current_page: 1,
                    last_page: 1,
                    total: 0,
                },
            );
        } catch (error) {
            console.error("Erreur chargement utilisateurs:", error);
        } finally {
            setLoading(false);
        }
    };

    const clearSearch = () => {
        setSearch("");
        setDebouncedSearch("");
    };

    const clearFilters = () => {
        setFilters({
            role: "",
            is_active: "",
            date: "",
            sort_by: "created_at",
            sort_order: "desc",
        });
    };

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const handleToggleActive = async (userId, currentStatus) => {
        if (
            !confirm(
                `Voulez-vous ${currentStatus ? "désactiver" : "activer"} ce compte ?`,
            )
        ) {
            return;
        }

        try {
            await axios.patch(`/web-api/users/${userId}/toggle-active`);
            fetchUsers(pagination.current_page);
        } catch (error) {
            console.error("Erreur:", error);
            alert("Erreur lors de la modification du statut");
        }
    };

    const handleDelete = async (userId, userName) => {
        if (userId === currentUser?.id) {
            alert("Vous ne pouvez pas supprimer votre propre compte");
            return;
        }

        if (
            !confirm(
                `Êtes-vous sûr de vouloir supprimer l'utilisateur ${userName} ?`,
            )
        ) {
            return;
        }

        try {
            await axios.delete(`/web-api/users/${userId}`);
            fetchUsers(pagination.current_page);
        } catch (error) {
            console.error("Erreur:", error);
            alert("Erreur lors de la suppression");
        }
    };

    const getRoleBadge = (role) => {
        const colors = {
            admin: "bg-purple-100 text-purple-800",
            contributor: "bg-green-100 text-green-800",
            reader: "bg-gray-100 text-gray-800",
        };
        const labels = {
            admin: "Admin",
            contributor: "Contributeur",
            reader: "Lecteur",
        };
        const roleName = role?.name || "reader";
        return (
            <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${colors[roleName] || "bg-gray-100 text-gray-800"}`}
            >
                {labels[roleName] || roleName}
            </span>
        );
    };

    const hasActiveFilters =
        filters.role ||
        filters.is_active !== "" ||
        filters.date;

    return (
        <AdminLayout>
            {/* En-tête */}
            <div className="mb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                            <Users size={32} className="mr-3 text-blue-600" />
                            Utilisateurs
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Gérez les comptes utilisateurs et leurs rôles
                        </p>
                    </div>
                    <Link
                        href="/users/create"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                    >
                        <UserPlus size={20} className="mr-2" />
                        Nouvel utilisateur
                    </Link>
                </div>

                {/* Barre de recherche principale */}
                <div className="mt-6 flex gap-4">
                    <div className="flex-1 relative">
                        <Search
                            size={18}
                            className="absolute left-3 top-3 text-gray-400"
                        />
                        <input
                            type="text"
                            placeholder="Rechercher par nom ou email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {search && (
                            <button
                                onClick={clearSearch}
                                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>
                    {/* Bouton filtres */}
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center px-4 py-2 rounded-lg border ${
                                showFilters || hasActiveFilters
                                    ? "bg-blue-50 border-blue-500 text-blue-700"
                                    : "border-gray-300 text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            <Filter size={18} className="mr-2" />
                            Filtres avancés
                            {hasActiveFilters && (
                                <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                                    Actifs
                                </span>
                            )}
                        </button>

                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="text-sm text-red-600 hover:text-red-800"
                            >
                                Réinitialiser les filtres
                            </button>
                        )}
                    </div>
                </div>

                {/* Panneau des filtres avancés */}
                {showFilters && (
                    <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center mb-4">
                            <SlidersHorizontal
                                size={18}
                                className="text-gray-500 mr-2"
                            />
                            <span className="font-medium text-gray-700">
                                Filtres avancés
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Filtre par rôle */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Rôle
                                </label>
                                <select
                                    value={filters.role}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "role",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Tous les rôles</option>
                                    <option value="admin">Admin</option>
                                    <option value="contributor">
                                        Contributeur
                                    </option>
                                    <option value="reader">Lecteur</option>
                                </select>
                            </div>

                            {/* Filtre par statut */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Statut
                                </label>
                                <select
                                    value={filters.is_active}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "is_active",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Tous les statuts</option>
                                    <option value="true">Actif</option>
                                    <option value="false">Inactif</option>
                                </select>
                            </div>

                            {/* Filtre par date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    value={filters.date}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "date",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Tri */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                        Trier par
                                    </label>
                                    <select
                                        value={filters.sort_by}
                                        onChange={(e) =>
                                            handleFilterChange(
                                                "sort_by",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="created_at">
                                            Date de création
                                        </option>
                                        <option value="name">Nom</option>
                                        <option value="email">Email</option>
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                        Ordre
                                    </label>
                                    <select
                                        value={filters.sort_order}
                                        onChange={(e) =>
                                            handleFilterChange(
                                                "sort_order",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="desc">
                                            Décroissant
                                        </option>
                                        <option value="asc">Croissant</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Liste des utilisateurs */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : users.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <Users size={64} className="mx-auto mb-4 text-gray-300" />
                    <h3 className="text-xl font-medium text-gray-700 mb-2">
                        Aucun utilisateur trouvé
                    </h3>
                    <p className="text-gray-500 mb-6">
                        {search || hasActiveFilters
                            ? "Essayez d'autres filtres"
                            : "Commencez par créer un utilisateur"}
                    </p>
                </div>
            ) : (
                <>
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Utilisateur
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Rôle
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Statut
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date d'inscription
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold mr-3">
                                                    {user.name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-800">
                                                        {user.name}
                                                        {user.id ===
                                                            currentUser?.id && (
                                                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                                                Vous
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-gray-500 flex items-center">
                                                        <Mail
                                                            size={12}
                                                            className="mr-1"
                                                        />
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getRoleBadge(user.roles?.[0])}
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.is_active ? (
                                                <span className="flex items-center text-green-600">
                                                    <CheckCircle
                                                        size={16}
                                                        className="mr-1"
                                                    />
                                                    Actif
                                                </span>
                                            ) : (
                                                <span className="flex items-center text-red-600">
                                                    <XCircle
                                                        size={16}
                                                        className="mr-1"
                                                    />
                                                    Inactif
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <Calendar
                                                    size={14}
                                                    className="mr-1"
                                                />
                                                {new Date(
                                                    user.created_at,
                                                ).toLocaleDateString("fr-FR")}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() =>
                                                        handleToggleActive(
                                                            user.id,
                                                            user.is_active,
                                                        )
                                                    }
                                                    className={`p-2 rounded-lg transition-colors ${
                                                        user.is_active
                                                            ? "hover:bg-yellow-100 text-yellow-600"
                                                            : "hover:bg-green-100 text-green-600"
                                                    }`}
                                                    title={
                                                        user.is_active
                                                            ? "Désactiver"
                                                            : "Activer"
                                                    }
                                                >
                                                    <RefreshCw size={18} />
                                                </button>
                                                <Link
                                                    href={`/users/${user.id}/edit`}
                                                    className="p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors"
                                                    title="Modifier"
                                                >
                                                    <Edit2 size={18} />
                                                </Link>
                                                {user.id !==
                                                    currentUser?.id && (
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                user.id,
                                                                user.name,
                                                            )
                                                        }
                                                        className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
                                                        title="Supprimer"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pagination.last_page > 1 && (
                        <div className="mt-8 flex justify-center">
                            <nav className="flex items-center space-x-2">
                                <button
                                    onClick={() =>
                                        fetchUsers(pagination.current_page - 1)
                                    }
                                    disabled={pagination.current_page === 1}
                                    className="px-3 py-1 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Précédent
                                </button>

                                {[...Array(pagination.last_page)].map(
                                    (_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => fetchUsers(i + 1)}
                                            className={`px-3 py-1 border rounded-lg ${
                                                pagination.current_page ===
                                                i + 1
                                                    ? "bg-blue-600 text-white border-blue-600"
                                                    : "hover:bg-gray-50"
                                            }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ),
                                )}

                                <button
                                    onClick={() =>
                                        fetchUsers(pagination.current_page + 1)
                                    }
                                    disabled={
                                        pagination.current_page ===
                                        pagination.last_page
                                    }
                                    className="px-3 py-1 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Suivant
                                </button>
                            </nav>
                        </div>
                    )}
                </>
            )}
        </AdminLayout>
    );
}
