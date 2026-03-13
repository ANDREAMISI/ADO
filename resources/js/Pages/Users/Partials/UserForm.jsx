// resources/js/Pages/Users/Partials/UserForm.jsx
import React, { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { Save, X, User, Mail, Lock, Shield, AlertCircle } from "lucide-react";
import axios from "@/Services/axios";

export default function UserForm({ user = null, onSuccess, onCancel }) {
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        password: "",
        password_confirmation: "",
        role: user?.roles?.[0]?.name || "reader",
        is_active: user?.is_active ?? true,
    });

    const [roles, setRoles] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [loadingRoles, setLoadingRoles] = useState(true);

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            const response = await axios.get("/web-api/roles");
            setRoles(response.data.roles || []);
        } catch (error) {
            console.error("Erreur chargement rôles:", error);
        } finally {
            setLoadingRoles(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        // Effacer l'erreur pour ce champ
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            // Validation côté client
            if (formData.password !== formData.password_confirmation) {
                setErrors({
                    password_confirmation:
                        "Les mots de passe ne correspondent pas",
                });
                setLoading(false);
                return;
            }

            const dataToSend = { ...formData };

            // Si pas de mot de passe (en édition), on ne l'envoie pas
            if (user && !dataToSend.password) {
                delete dataToSend.password;
                delete dataToSend.password_confirmation;
            }

            if (user) {
                // Mode édition
                await axios.put(`/web-api/users/${user.id}`, dataToSend);
            } else {
                // Mode création
                await axios.post("/web-api/users", dataToSend);
            }

            onSuccess();
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors || {});
            } else {
                console.error("Erreur:", error);
                alert("Une erreur est survenue");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nom */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <User
                        size={18}
                        className="absolute left-3 top-3 text-gray-400"
                    />
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.name ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Jean Dupont"
                    />
                </div>
                {errors.name && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle size={14} className="mr-1" />
                        {errors.name[0]}
                    </p>
                )}
            </div>

            {/* Email */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <Mail
                        size={18}
                        className="absolute left-3 top-3 text-gray-400"
                    />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.email ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="jean@exemple.com"
                    />
                </div>
                {errors.email && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle size={14} className="mr-1" />
                        {errors.email[0]}
                    </p>
                )}
            </div>

            {/* Mot de passe */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe{" "}
                    {!user && <span className="text-red-500">*</span>}
                    {user && (
                        <span className="text-xs text-gray-500 ml-2">
                            (laisser vide pour ne pas changer)
                        </span>
                    )}
                </label>
                <div className="relative">
                    <Lock
                        size={18}
                        className="absolute left-3 top-3 text-gray-400"
                    />
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required={!user}
                        minLength={8}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.password
                                ? "border-red-500"
                                : "border-gray-300"
                        }`}
                        placeholder="••••••••"
                    />
                </div>
                {errors.password && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle size={14} className="mr-1" />
                        {errors.password[0]}
                    </p>
                )}
            </div>

            {/* Confirmation mot de passe */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmer le mot de passe{" "}
                    {!user && <span className="text-red-500">*</span>}
                </label>
                <div className="relative">
                    <Lock
                        size={18}
                        className="absolute left-3 top-3 text-gray-400"
                    />
                    <input
                        type="password"
                        name="password_confirmation"
                        value={formData.password_confirmation}
                        onChange={handleChange}
                        required={!user}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.password_confirmation
                                ? "border-red-500"
                                : "border-gray-300"
                        }`}
                        placeholder="••••••••"
                    />
                </div>
                {errors.password_confirmation && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle size={14} className="mr-1" />
                        {errors.password_confirmation}
                    </p>
                )}
            </div>

            {/* Rôle */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rôle <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <Shield
                        size={18}
                        className="absolute left-3 top-3 text-gray-400"
                    />
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                        disabled={loadingRoles}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white ${
                            errors.role ? "border-red-500" : "border-gray-300"
                        } ${loadingRoles ? "opacity-50" : ""}`}
                    >
                        <option value="">Sélectionnez un rôle</option>
                        {roles.map((role) => (
                            <option key={role} value={role}>
                                {role === "admin"
                                    ? "Administrateur"
                                    : role === "contributor"
                                      ? "Contributeur"
                                      : role === "reader"
                                        ? "Lecteur"
                                        : role}
                            </option>
                        ))}
                    </select>
                </div>
                {errors.role && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle size={14} className="mr-1" />
                        {errors.role[0]}
                    </p>
                )}
            </div>

            {/* Statut actif/inactif */}
            <div>
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                        Compte actif
                    </span>
                </label>
                <p className="text-xs text-gray-500 mt-1">
                    Un compte inactif ne peut pas se connecter
                </p>
            </div>

            {/* Boutons */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                >
                    <X size={18} className="mr-2" />
                    Annuler
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                    {loading ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Enregistrement...
                        </>
                    ) : (
                        <>
                            <Save size={18} className="mr-2" />
                            {user ? "Mettre à jour" : "Créer"}
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
