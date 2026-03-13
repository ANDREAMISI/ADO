import React, { useState } from "react";
import { Link, router } from "@inertiajs/react";
import {
    Mail,
    Building2,
    User,
    Send,
    CheckCircle,
    AlertCircle,
} from "lucide-react";

export default function AccessRequest() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        company: "",
        reason: "",
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await axios.post(
                "/web-api/access-request",
                formData,
            );

            if (response.data.success) {
                setSuccess(true);
                setFormData({ name: "", email: "", company: "", reason: "" });
            }
        } catch (error) {
            setError(
                error.response?.data?.message || "Une erreur est survenue",
            );
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={40} className="text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Demande envoyée !
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Votre demande d'accès a été envoyée avec succès. Vous
                        recevrez un email de confirmation après validation par
                        un administrateur.
                    </p>
                    <Link
                        href="/"
                        className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Retour à l'accueil
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg mb-4">
                        <span className="text-2xl font-bold text-white">A</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Archidoc
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Plateforme de gestion documentaire
                    </p>
                </div>

                {/* Formulaire */}
                <div className="bg-white rounded-xl shadow-xl p-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                        Demander un accès
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Remplissez ce formulaire pour demander la création de
                        votre compte.
                    </p>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                            <AlertCircle
                                size={20}
                                className="text-red-600 mr-3 flex-shrink-0 mt-0.5"
                            />
                            <p className="text-red-700">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Nom */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nom complet{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <User
                                    size={18}
                                    className="absolute left-3 top-3.5 text-gray-400"
                                />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Entrer votre nom"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email professionnel{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Mail
                                    size={18}
                                    className="absolute left-3 top-3.5 text-gray-400"
                                />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="vous@entreprise.com"
                                />
                            </div>
                        </div>

                        {/* Entreprise */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Entreprise{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Building2
                                    size={18}
                                    className="absolute left-3 top-3.5 text-gray-400"
                                />
                                <input
                                    type="text"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Nom de l'entreprise"
                                />
                            </div>
                        </div>

                        {/* Motif */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Motif de la demande{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="reason"
                                value={formData.reason}
                                onChange={handleChange}
                                required
                                rows="4"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Décrivez brièvement vos besoins..."
                            />
                        </div>

                        {/* Bouton */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 font-semibold flex items-center justify-center disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                    Envoi en cours...
                                </>
                            ) : (
                                <>
                                    <Send size={18} className="mr-2" />
                                    Envoyer la demande
                                </>
                            )}
                        </button>
                    </form>

                    {/* Lien retour */}
                    <p className="text-center mt-6 text-sm text-gray-600">
                        Déjà un compte ?{" "}
                        <Link
                            href="/login"
                            className="text-blue-600 hover:underline font-medium"
                        >
                            Se connecter
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
