import React, { useState, useEffect } from "react";
import ModernLayout from "@/Layouts/ModernLayout";
import axios from "@/Services/axios";
import toast from 'react-hot-toast';
import {
    CheckCircle,
    XCircle,
    Clock,
    Mail,
    Building2,
    User,
    Eye,
} from "lucide-react";

export default function AccessRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await axios.get("/web-api/users/access-requests");
            setRequests(response.data.data || []);
        } catch (error) {
            console.error("Erreur chargement:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await axios.post(`/web-api/users/access-requests/${id}/approve`);
            fetchRequests();
        } catch (error) {
            toast.error("Erreur lors de l'approbation");
        }
    };

    const handleReject = async (id) => {
        try {
            await axios.post(`/web-api/users/access-requests/${id}/reject`, {
                notes: null,
            });
            fetchRequests();
        } catch (error) {
            toast.error("Erreur lors du rejet");
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: {
                bg: "bg-yellow-100",
                text: "text-yellow-700",
                icon: Clock,
                label: "En attente",
            },
            approved: {
                bg: "bg-green-100",
                text: "text-green-700",
                icon: CheckCircle,
                label: "Approuvé",
            },
            rejected: {
                bg: "bg-red-100",
                text: "text-red-700",
                icon: XCircle,
                label: "Rejeté",
            },
        };
        const badge = badges[status] || badges.pending;
        return badge;
    };

    return (
        <ModernLayout>
            <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">
                    Demandes d'accès
                </h1>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : requests.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <p className="text-gray-500">
                            Aucune demande en attente
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {requests.map((request) => {
                            const badge = getStatusBadge(request.status);
                            const Icon = badge.icon;

                            return (
                                <div
                                    key={request.id}
                                    className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-3">
                                                <h3 className="font-semibold text-lg">
                                                    {request.name}
                                                </h3>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text} flex items-center`}
                                                >
                                                    <Icon
                                                        size={12}
                                                        className="mr-1"
                                                    />
                                                    {badge.label}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 mb-3">
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <Mail
                                                        size={14}
                                                        className="mr-2"
                                                    />
                                                    {request.email}
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <Building2
                                                        size={14}
                                                        className="mr-2"
                                                    />
                                                    {request.company}
                                                </div>
                                            </div>

                                            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                                                {request.reason}
                                            </p>
                                        </div>

                                        {request.status === "pending" && (
                                            <div className="flex space-x-2 ml-4">
                                                <button
                                                    onClick={() =>
                                                        handleApprove(
                                                            request.id,
                                                        )
                                                    }
                                                    className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                                                    title="Approuver"
                                                >
                                                    <CheckCircle size={20} />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleReject(request.id)
                                                    }
                                                    className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                                                    title="Rejeter"
                                                >
                                                    <XCircle size={20} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </ModernLayout>
    );
}
