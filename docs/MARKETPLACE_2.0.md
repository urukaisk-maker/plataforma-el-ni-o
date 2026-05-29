# Marketplace 2.0 con Revision Colaborativa

> Objetivo: crear un ecosistema autosostenible de contenido educativo creado por profesores.

---

## 1. Vision del Marketplace

Los profesores crean lecciones con el editor de bloques. Los contenidos se publican en el marketplace donde otros educadores pueden:

- **Usar gratis** lecciones bajo licencia Creative Commons
- **Comprar** lecciones premium (regalias al autor)
- **Calificar y comentar** (sistema de reputacion)
- **Reportar** contenido inapropiado

---

## 2. Modelo de Regalias

| Tipo de contenido | Precio | Regalia autor | Plataforma |
|-------------------|--------|--------------|------------|
| Gratuito (CC BY) | 0 EUR | 0 EUR | 0 EUR |
| Premium basico | 2.99 EUR | 2.10 EUR (70%) | 0.89 EUR (30%) |
| Premium avanzado | 9.99 EUR | 7.00 EUR (70%) | 2.99 EUR (30%) |
| Pack colegio | 49 EUR | 34.30 EUR (70%) | 14.70 EUR (30%) |

---

## 3. Sistema de Reputacion

Los profesores acumulan puntos de reputacion:

| Accion | Puntos |
|--------|--------|
| Publicar una leccion | +10 |
| Obtener 5 estrellas | +25 |
| Ser descargado 100 veces | +50 |
| Responder un comentario | +5 |
| Ser reportado (validado) | -100 |

**Niveles de reputacion:**
- Bronce: 0-99 puntos
- Plata: 100-499 puntos
- Oro: 500-1999 puntos
- Platino: 2000+ puntos (insignia especial, mayor visibilidad)

---

## 4. Flujo de Revision Colaborativa

```
Profesor crea leccion
    |
    v
Enviar a revision (auto o peer)
    |
    v
+----------------------------+
| Revisores voluntarios      |
| (minimo 3 aprobaciones)    |
|                            |
| - Exactitud del contenido  |
| - Adecuacion para la edad  |
| - Calidad pedagogica       |
| - Sin errores gramaticales |
+----------------------------+
    |
    v
Aprobado → Publicado en marketplace
    |
    v
O Rechazado → Feedback al autor
```

---

## 5. Sistema de Reportes

| Motivo de reporte | Accion automatica |
|-------------------|-------------------|
| Contenido inapropiado | Ocultar temporalmente |
| Informacion incorrecta | Etiqueta "en revision" |
| Derechos de autor | Suspender inmediatamente |
| Spam | Eliminar + advertencia |

**Proceso:**
1. Usuario reporta con motivo
2. Sistema oculta temporalmente (si >= 3 reportes)
3. Moderador revisa en 48h
4. Decision: aprobar, rechazar o solicitar cambios

---

## 6. Estructura de Datos (SQL)

```sql
CREATE TABLE marketplace_lessons (
  id UUID PRIMARY KEY,
  author_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT,
  blocks JSONB NOT NULL, -- Array de bloques del editor
  subject TEXT,
  difficulty TEXT,
  price DECIMAL(10,2) DEFAULT 0,
  license TEXT DEFAULT 'CC-BY',
  published BOOLEAN DEFAULT FALSE,
  downloads INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE marketplace_reviews (
  id UUID PRIMARY KEY,
  lesson_id UUID REFERENCES marketplace_lessons(id),
  reviewer_id UUID REFERENCES users(id),
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE marketplace_royalties (
  id UUID PRIMARY KEY,
  author_id UUID REFERENCES users(id),
  lesson_id UUID REFERENCES marketplace_lessons(id),
  amount DECIMAL(10,2),
  sale_date TIMESTAMP DEFAULT NOW()
);

CREATE TABLE marketplace_reports (
  id UUID PRIMARY KEY,
  lesson_id UUID REFERENCES marketplace_lessons(id),
  reporter_id UUID REFERENCES users(id),
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, reviewed, dismissed
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 7. Roadmap de Implementacion

| Fase | Tarea | Tiempo |
|------|-------|--------|
| 1 | Backend: tablas SQL + API REST | 16h |
| 2 | Integracion pagos (Stripe) | 8h |
| 3 | Sistema de revision peer-to-peer | 12h |
| 4 | Panel de autor (analytics, regalias) | 10h |
| 5 | Moderacion y reportes | 8h |
| **Total** | | **~54h** |

---

*Documento creado por Manuel Casimiro Carrasco, Desarrollador Web*
*Plataforma El Nino -- 2026*
