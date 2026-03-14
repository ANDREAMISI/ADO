import React, { useState } from "react";
import { Link, router } from "@inertiajs/react";
import axios from "@/Services/axios";
import { useToast } from "@/Hooks/useToast";
import {
    FileText,
    Shield,
    Lock,
    Users,
    ChevronRight,
    Mail,
    Phone,
    Building2,
    User,
    Send,
    CheckCircle,
    AlertCircle,
    Search,
    FolderTree,
    Clock,
    HardDrive,
    Upload,
    FileCheck,
    History,
    Key,
    Bell,
    Settings,
    Download,
    Share2,
    Trash2,
    Edit3,
    Copy,
    Eye,
    Star,
    Filter,
    Grid,
    List,
    Plus,
    MoreVertical,
    Archive,
    File,
    Image,
    FileText as FileDoc,
    FileSpreadsheet,
    FileJson,
    FileCode,
    X,
    Menu,
    LogOut,
    UserCircle,
    HelpCircle,
    BookOpen,
    Award,
    Globe,
    Calendar,
    Facebook,
    Twitter,
    Linkedin,
    Youtube,
    Instagram,
    Github,
    TrendingUp,
    MessageCircle,
    Play,
    Tag,
} from "lucide-react";

export default function Welcome() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        company: "",
        phone: "",
        reason: "",
    });
    const toast = useToast();
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Couleur principale : #1901E6
    const primaryColor = "#1901E6";

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
            // Appel à la route PUBLIQUE pour la demande d'accès
            const response = await axios.post("/web-api/access-request", {
                name: formData.name,
                email: formData.email,
                company: formData.company,
                reason: formData.reason,
            });

            if (response.data.success) {
                setSubmitted(true);
                toast.success("Demande envoyée avec succès !");
                setFormData({
                    name: "",
                    email: "",
                    company: "",
                    phone: "",
                    reason: "",
                });
            }
        } catch (error) {
            console.error("Erreur:", error);
            const errorMessage =
                error.response?.data?.message || "Une erreur est survenue";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={40} className="text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Demande envoyée !
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Votre demande d'accès a été envoyée. Vous recevrez un
                        email après validation par un administrateur.
                    </p>
                    <Link href="/" className="text-blue-600 hover:underline">
                        Retour à l'accueil
                    </Link>
                </div>
            </div>
        );
    }

    const features = [
        {
            icon: Shield,
            title: "Sécurité maximale",
            description:
                "Chiffrement AES-256, authentification 2FA, et conformité RGPD pour une protection optimale de vos documents.",
            color: "blue",
        },
        {
            icon: Lock,
            title: "Contrôle d'accès granulaire",
            description:
                "Permissions personnalisables par document, dossier, ou utilisateur avec gestion fine des rôles.",
            color: "purple",
        },
        {
            icon: Users,
            title: "Collaboration en temps réel",
            description:
                "Partage sécurisé, commentaires, et versions multiples pour une collaboration d'équipe efficace.",
            color: "green",
        },
        {
            icon: Search,
            title: "Recherche intelligente",
            description:
                "Recherche full-text, filtres avancés, et OCR pour retrouver instantanément vos documents.",
            color: "orange",
        },
        {
            icon: History,
            title: "Historique complet",
            description:
                "Traçabilité totale : qui a consulté, modifié ou partagé chaque document, avec horodatage.",
            color: "red",
        },
        {
            icon: FolderTree,
            title: "Classification automatique",
            description:
                "Organisation intelligente des documents par type, date, ou contenu avec règles personnalisables.",
            color: "indigo",
        },
    ];

    const stats = [
        { value: "10M+", label: "Documents archivés", icon: FileText },
        { value: "120+", label: "Catégories", icon: FolderTree },
        { value: "500+", label: "Tags", icon: Tag },
        { value: "50TB", label: "Données sécurisées", icon: HardDrive },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 fixed w-full z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20 items-center">
                        {/* Logo avec la couleur primaire */}
                        <div className="flex items-center space-x-3 group cursor-pointer">
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg"
                                style={{ backgroundColor: primaryColor }}
                            >
                                <Archive size={22} className="text-white" />
                            </div>
                            <span
                                className="font-bold text-2xl text-gray-800 group-hover:text-blue-600 transition-colors"
                                style={{ color: primaryColor }}
                            >
                                Archidoc
                            </span>
                        </div>

                        {/* Auth buttons */}
                        <div className="hidden md:flex items-center space-x-4">
                            <Link
                                href="/login"
                                className="px-5 py-2.5 text-gray-700 hover:text-blue-600 transition-colors font-medium flex items-center"
                            >
                                <LogOut size={18} className="mr-2 rotate-180" />
                                Connexion
                            </Link>
                            <Link
                                href="#request"
                                className="px-5 py-2.5 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium flex items-center"
                                style={{ backgroundColor: primaryColor }}
                            >
                                <UserCircle size={18} className="mr-2" />
                                Demande d'accès
                            </Link>
                        </div>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            {mobileMenuOpen ? (
                                <X size={24} />
                            ) : (
                                <Menu size={24} />
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 px-4 overflow-hidden">
                {/* Background décoratif */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#1901e6] via-white to-purple-50"></div>
                <div className="absolute inset-0 opacity-20">
                    <div
                        className="absolute top-20 left-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
                        style={{ backgroundColor: primaryColor }}
                    ></div>
                    <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
                </div>

                <div className="max-w-7xl mx-auto relative">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            {/* Badge */}
                            <div
                                className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold"
                                style={{
                                    backgroundColor: primaryColor + "10",
                                    color: primaryColor,
                                }}
                            >
                                <Shield size={16} className="mr-2 " />
                                #1 Solution d'archivage Au Burundi
                            </div>

                            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                                Archivez et gérez vos
                                <span
                                    className="block"
                                    style={{ color: primaryColor }}
                                >
                                    documents en toute sécurité
                                </span>
                            </h1>

                            <p className="text-xl text-gray-600 leading-relaxed">
                                Plateforme securisee de gestion documentaire
                                pour entreprises, controle d'acces,
                                classification et recherche avancee.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Link
                                    href="#request"
                                    className="px-8 py-4 text-white rounded-xl hover:shadow-lg transition-all duration-300 text-center font-semibold text-lg flex items-center justify-center group"
                                    style={{ backgroundColor: primaryColor }}
                                >
                                    Demande d'accès
                                    <ChevronRight
                                        size={20}
                                        className="ml-2 group-hover:translate-x-1 transition-transform"
                                    />
                                </Link>
                                <Link
                                    href="/login"
                                    className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-blue-600 hover:text-blue-600 transition-all duration-300 text-center font-semibold text-lg flex items-center justify-center"
                                >
                                    Se connecter
                                </Link>
                            </div>
                        </div>

                        {/* Interface simulée */}
                        <div className="relative">
                            <div className="bg-white rounded-3xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                                <div
                                    className="rounded-2xl p-8 text-white"
                                    style={{
                                        background: `linear-gradient(135deg, ${primaryColor}, #7C3AED)`,
                                    }}
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center">
                                            <Archive
                                                size={32}
                                                className="mr-3"
                                            />
                                            <h3 className="text-2xl font-bold">
                                                Archidoc Secure
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Interface simulée */}
                                    <div className="space-y-4">
                                        <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <FileText
                                                        size={20}
                                                        className="mr-3"
                                                    />
                                                    <div>
                                                        <div className="font-medium">
                                                            Contrat.pdf
                                                        </div>
                                                        <div className="text-sm text-blue-200">
                                                            Modifié il y a 2min
                                                        </div>
                                                    </div>
                                                </div>
                                                <Lock
                                                    size={18}
                                                    className="text-blue-200"
                                                />
                                            </div>
                                        </div>
                                        <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <Image
                                                        size={20}
                                                        className="mr-3"
                                                    />
                                                    <div>
                                                        <div className="font-medium">
                                                            Plan_architecte.jpg
                                                        </div>
                                                        <div className="text-sm text-blue-200">
                                                            Chiffré AES-256
                                                        </div>
                                                    </div>
                                                </div>
                                                <Shield
                                                    size={18}
                                                    className="text-blue-200"
                                                />
                                            </div>
                                        </div>
                                        <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <FileSpreadsheet
                                                        size={20}
                                                        className="mr-3"
                                                    />
                                                    <div>
                                                        <div className="font-medium">
                                                            Données_clients.xlsx
                                                        </div>
                                                        <div className="text-sm text-blue-200">
                                                            Version 3.2
                                                        </div>
                                                    </div>
                                                </div>
                                                <Users
                                                    size={18}
                                                    className="text-blue-200"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section Pourquoi nous choisir */}
            <div className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                        Pourquoi nous choisir
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <div key={index} className="text-center group">
                                    <div
                                        className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                                        style={{
                                            backgroundColor:
                                                primaryColor + "20",
                                        }}
                                    >
                                        <Icon
                                            size={32}
                                            style={{ color: primaryColor }}
                                        />
                                    </div>
                                    <div className="text-3xl font-bold text-gray-900 mb-1">
                                        {stat.value}
                                    </div>
                                    <div className="text-gray-600">
                                        {stat.label}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Formulaire de demande d'accès */}
            <div
                id="request"
                className="py-16"
                style={{
                    background: `linear-gradient(135deg, #ffffff, #9c92f5, #4936ea)`,
                }}
            >
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Demander un accès
                            </h2>
                            <p className="text-xl text-gray-600">
                                Remplissez ce formulaire pour demander la
                                création de votre compte
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start">
                                    <AlertCircle
                                        size={20}
                                        className="text-red-600 mr-3 flex-shrink-0 mt-0.5"
                                    />
                                    <p className="text-red-700">{error}</p>
                                </div>
                            )}

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nom complet *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent"
                                        style={{
                                            focusRingColor: primaryColor,
                                        }}
                                        placeholder="Entrer votre nom"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email professionnel *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent"
                                        style={{
                                            focusRingColor: primaryColor,
                                        }}
                                        placeholder="nom@entreprise.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Entreprise *
                                    </label>
                                    <input
                                        type="text"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent"
                                        style={{
                                            focusRingColor: primaryColor,
                                        }}
                                        placeholder="Nom de l'entreprise"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Téléphone
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent"
                                        style={{
                                            focusRingColor: primaryColor,
                                        }}
                                        placeholder="+257 XX XX XX XX"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Motif de la demande *
                                </label>
                                <textarea
                                    name="reason"
                                    value={formData.reason}
                                    onChange={handleChange}
                                    required
                                    rows="4"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent"
                                    style={{ focusRingColor: primaryColor }}
                                    placeholder="Décrivez brièvement vos besoins..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full px-6 py-4 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold text-lg flex items-center justify-center disabled:opacity-50"
                                style={{ backgroundColor: primaryColor }}
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                                        Envoi en cours...
                                    </>
                                ) : (
                                    <>
                                        Envoyer
                                        <Send size={20} className="ml-2" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-white pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
                        {/* Logo et description */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center space-x-3 mb-4">
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                                    style={{ backgroundColor: primaryColor }}
                                >
                                    <Archive size={22} className="text-white" />
                                </div>
                                <span
                                    className="font-bold text-2xl"
                                    style={{ color: primaryColor }}
                                >
                                    Archidoc
                                </span>
                            </div>
                            <p className="text-gray-400 mb-4 max-w-md">
                                Plateforme sécurisée de gestion documentaire
                                pour entreprises
                            </p>
                            <div className="flex space-x-4">
                                <Link
                                    href="#"
                                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
                                >
                                    <Facebook size={18} />
                                </Link>
                                <Link
                                    href="#"
                                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
                                >
                                    <Twitter size={18} />
                                </Link>
                                <Link
                                    href="#"
                                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
                                >
                                    <Linkedin size={18} />
                                </Link>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold text-lg mb-4">
                                Produit
                            </h4>
                            <ul className="space-y-3">
                                <li>
                                    <Link
                                        href="#features"
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        Fonctionnalités
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="#"
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        Sécurité
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold text-lg mb-4">
                                Ressources
                            </h4>
                            <ul className="space-y-3">
                                <li>
                                    <Link
                                        href="#"
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        Documentation
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="#"
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        Support
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold text-lg mb-4">
                                Légal
                            </h4>
                            <ul className="space-y-3">
                                <li>
                                    <Link
                                        href="#"
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        Confidentialité
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="#"
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        Mentions légales
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
                        <p>© 2026 Archidoc. Tous droits réservés.</p>
                    </div>
                </div>
            </footer>

            {/* Bouton de chat flottant */}
            <div className="fixed bottom-6 right-6">
                <button
                    className="text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
                    style={{ backgroundColor: primaryColor }}
                >
                    <MessageCircle size={24} />
                    <span className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                        Besoin d'aide ?
                    </span>
                </button>
            </div>
        </div>
    );
}
