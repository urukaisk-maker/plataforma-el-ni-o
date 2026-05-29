# Seguridad y Cumplimiento Normativo Extremo — Plataforma El Nino

> Objetivo: tranquilidad absoluta para padres e instituciones.

---

## 1. Auditoria de Seguridad

### Headers de seguridad implementados

| Header | Valor | Proposito |
|--------|-------|-----------|
| Content-Security-Policy | default-src 'self'; ... | Bloquea XSS, inyeccion de scripts |
| Strict-Transport-Security | max-age=63072000; preload | Fuerza HTTPS, preloading HSTS |
| X-Content-Type-Options | nosniff | Evita MIME sniffing |
| X-Frame-Options | DENY | Bloquea clickjacking |
| Referrer-Policy | strict-origin-when-cross-origin | Limita filtrado de URL |
| Permissions-Policy | camera=(), microphone=()... | Desactiva APIs sensibles |

### Archivos
- `src/js/utils/security-headers.js` — Generador de headers + checklist de auditoria
- `netlify.toml` / nginx config — Aplicar headers en servidor

### Checklist de pentest (24 items)

```javascript
import { SECURITY_CHECKLIST, runSecurityAudit } from './security-headers.js';
// runSecurityAudit() verifica HTTPS y configuracion local
```

---

## 2. COPPA Safe Harbor + GDPR-K

### Regulaciones

| Aspecto | COPPA (EE.UU.) | GDPR-K (UE) |
|---------|---------------|-------------|
| Edad minima | 13 anos | 16 anos (o 13 con consentimiento parental) |
| Consentimiento | Verificable parental | Explicito e informado |
| Datos recogidos | Minimos estrictos | Minimizacion de datos |
| Derecho al olvido | No explicito | Si, con confirmacion |
| Penalizaciones | $43,792 USD por infraccion | 4% del volumen de negocio |

### Implementacion

| Feature | Archivo | Estado |
|---------|---------|--------|
| Verificacion de edad | `parental-consent.js` — checkAge() | ✅ |
| Solicitud de consentimiento | `parental-consent.js` — requestParentalConsent() | ✅ |
| Verificacion por token | `parental-consent.js` — verifyParentalConsent() | ✅ |
| Revocacion | `parental-consent.js` — revokeConsent() | ✅ |
| Estado valido | `parental-consent.js` — hasValidConsent() | ✅ |

### Flujo de consentimiento

```
1. Nino registra fecha de nacimiento
2. Si < 13 anos: bloqueo de funciones sociales/fotos
3. Email al padre con token unico
4. Padre hace click en link de verificacion
5. Token validado → cuenta activada
6. Padre puede revocar en cualquier momento
```

---

## 3. Panel de Privacidad para Padres

### Control granular

| Dato | Control | Default |
|------|---------|---------|
| Analitica anonima | Toggle | OFF |
| Registro de actividad | Toggle | ON |
| Gamificacion (XP, niveles) | Toggle | ON |
| Funciones sociales | Toggle | OFF |
| Subida de fotos | Toggle | OFF |
| Tutor IA | Toggle | ON |
| Notificaciones push | Toggle | OFF |

### Acciones

- **Exportar datos**: JSON completo con progreso, fotos, historial, configuracion
- **Borrado total**: Eliminacion permanente con doble confirmacion
- **Retencion automatica**: 30/90/180/365 dias o manual

### Archivo
- `panel-privacidad.html` — Pagina dedicada
- `src/js/ui/privacy-panel.js` — Logica del panel

---

## 4. Cifrado Extremo a Extremo (E2E)

### Arquitectura

```
Profesor                    Servidor                    Padre
   |                           |                           |
   |-- mensaje en claro        |                           |
   |-- cifra con AES-GCM      |                           |
   |-- envia payload base64 -->|                           |
   |                           |-- almacena payload       |
   |                           |   (servidor no puede    |
   |                           |    descifrar)            |
   |                           |<-- solicita payload -----|
   |                           |                           |
   |                           |-- envia payload -------->|
   |                           |                           |
   |                           |                           |-- descifra con clave
```

### API

```javascript
import { generateKey, encryptMessage, decryptMessage, exportKey, importKey } from './e2e-crypto.js';

const key = await generateKey();
const encrypted = await encryptMessage('Hola profesor', key);
const decrypted = await decryptMessage(encrypted, key); // 'Hola profesor'
```

### Limitaciones actuales (stub)
- Intercambio de claves: ECDH pendiente. Actualmente se comparte la clave fuera de banda.
- Rotacion de claves: manual.
- Forward secrecy: no implementada aun.

### Archivo
- `src/js/utils/e2e-crypto.js` — Web Crypto API (AES-GCM 256-bit)

---

## 5. Roadmap de certificacion

| Paso | Tiempo | Costo estimado |
|------|--------|---------------|
| Auditoria interna (checklist) | 1 semana | $0 (interno) |
| Pentest externo | 2-3 semanas | $3,000-8,000 |
| Certificacion COPPA Safe Harbor | 4-6 semanas | $5,000-15,000 |
| Certificacion GDPR (DPO externo) | 4-8 semanas | $5,000-12,000 |
| SOC 2 Type II (instituciones) | 3-6 meses | $15,000-40,000 |
| **Total** | **6-12 meses** | **~$28,000-75,000** |

---

## 6. Responsables recomendados

| Rol | Recomendacion |
|-----|--------------|
| DPO (Data Protection Officer) | Externo certificado en GDPR-K |
| Auditor de seguridad | Empresa especializada (e.g., Cure53, Bishop Fox) |
| Legal COPPA | Abogado especializado en proteccion infantil (EE.UU.) |

---

*Documento creado por Manuel Casimiro Carrasco, Desarrollador Web*
*Plataforma El Nino — 2026*
