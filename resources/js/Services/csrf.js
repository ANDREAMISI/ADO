// Fonction pour récupérer le token CSRF depuis la balise meta
export function getCsrfToken() {
    const token = document.querySelector('meta[name="csrf-token"]');
    return token ? token.getAttribute('content') : '';
}

// Ajouter le token CSRF aux en-têtes pour les requêtes non-GET
export function addCsrfToken(config) {
    const token = getCsrfToken();
    if (token && ['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase())) {
        config.headers['X-CSRF-TOKEN'] = token;
    }
    return config;
}