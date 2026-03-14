<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Nouvelle demande d'accès - Archidoc</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1901E6;">Nouvelle demande d'accès à Archidoc</h2>

        <p>Bonjour {{ $admin->name }},</p>

        <p>Une nouvelle demande d'accès a été soumise sur la plateforme Archidoc :</p>

        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Nom :</strong> {{ $request->name }}</p>
            <p><strong>Email :</strong> {{ $request->email }}</p>
            <p><strong>Entreprise :</strong> {{ $request->company }}</p>
            <p><strong>Motif :</strong> {{ $request->reason }}</p>
            <p><strong>Date :</strong> {{ $request->created_at->format('d/m/Y H:i') }}</p>
        </div>

        <p>Veuillez examiner cette demande et l'approuver ou la rejeter selon les critères établis.</p>

        <div style="text-align: center; margin: 30px 0;">
            <a href="{{ url('/admin/access-requests') }}"
               style="background: #1901E6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Voir les demandes d'accès
            </a>
        </div>

        <p>Cordialement,<br>L'équipe Archidoc</p>
    </div>
</body>
</html>