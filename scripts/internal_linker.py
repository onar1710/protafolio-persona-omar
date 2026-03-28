import os
import re
import random
import argparse
from dataclasses import dataclass
from typing import List, Optional, Tuple


BLOG_DIR = os.path.join("src", "content", "blog")


INTRODUCTORIOS_Y_CONTEXTUALES = [
    "como vimos en",
    "según explicamos en",
    "tal como detallamos en",
    "en nuestro artículo sobre",
    "en nuestra guía de",
    "como comentamos en",
    "según lo explicado en",
    "en el post sobre",
    "como te contamos en",
    "según nuestro análisis",
    "en nuestro contenido sobre",
    "como descubrirás en",
    "en nuestra publicación sobre",
    "como verás en",
    "según detallamos en",
    "en nuestro tutorial de",
    "como profundizamos en",
    "en nuestro estudio sobre",
    "como analizamos en",
    "según lo descrito en",
    "en la entrada sobre",
    "como compartimos en",
    "en nuestro recurso sobre",
    "como exploramos en",
    "según investigamos en",
    "en el contenido dedicado a",
    "como demostramos en",
    "en nuestra revisión de",
    "como indicamos en",
    "según abordamos en",
    "en nuestro análisis de",
    "como tratamos en",
    "en la publicación dedicada a",
    "como expusimos en",
    "según presentamos en",
    "en nuestro enfoque sobre",
    "como revisamos en",
    "en el artículo dedicado a",
    "como examinamos en",
    "según evaluamos en",
    "en nuestro post detallado sobre",
]

PROFUNDIZACION_Y_AMPLIFICACION = [
    "aprende más sobre",
    "descubre todo sobre",
    "conoce en detalle",
    "profundiza en",
    "amplía tu conocimiento sobre",
    "descubre los secretos de",
    "domina el arte de",
    "entiende mejor",
    "explora a fondo",
    "sumérgete en",
    "descifra los misterios de",
    "comprende completamente",
    "desentraña los secretos de",
    "aprende los fundamentos de",
    "descubre las claves de",
    "conoce los detalles de",
    "profundiza tu conocimiento en",
    "amplía información sobre",
    "descubre más acerca de",
    "conoce a profundidad",
    "aprende paso a paso",
    "descubre estrategias de",
    "domina las técnicas de",
    "entiende los principios de",
    "explora las posibilidades de",
    "sumérgete en el mundo de",
    "descifra los códigos de",
    "comprende los aspectos de",
    "desentraña los detalles de",
    "aprende las mejores prácticas de",
    "descubre el potencial de",
    "conoce las estrategias de",
    "profundiza en los conceptos de",
    "amplía tu visión sobre",
    "descubre las tendencias de",
    "conoce los secretos detrás de",
    "aprende los trucos de",
    "descubre cómo funciona",
    "domina los conceptos de",
    "entiende la importancia de",
    "explora las ventajas de",
    "sumérgete en las estrategias de",
    "descifra las técnicas de",
    "comprende el impacto de",
    "desentraña las metodologías de",
    "aprende todo lo necesario sobre",
    "descubre las oportunidades en",
    "conoce los beneficios de",
    "profundiza en las tácticas de",
    "amplía tus habilidades en",
]

ACCION_Y_RECOMENDACION = [
    "te recomendamos leer",
    "no te pierdas",
    "consulta nuestra guía",
    "echa un vistazo a",
    "revisa nuestro artículo sobre",
    "asegúrate de leer",
    "deberías revisar",
    "vale la pena consultar",
    "es fundamental conocer",
    "te invitamos a leer",
    "considera revisar",
    "sería útil consultar",
    "te sugerimos explorar",
    "merece la pena revisar",
    "no dejes de leer",
    "conviene consultar",
    "es importante revisar",
    "te aconsejamos leer",
    "deberías explorar",
    "vale la pena descubrir",
    "es esencial conocer",
    "te animamos a leer",
    "considera explorar",
    "sería beneficioso revisar",
    "te proponemos consultar",
    "merece atención",
    "no puedes perderte",
    "conviene explorar",
    "es valioso revisar",
    "te recomendamos explorar",
    "deberías descubrir",
    "vale la pena conocer",
    "es crucial leer",
    "te invitamos a explorar",
    "considera consultar",
    "sería interesante revisar",
    "te sugerimos revisar",
    "merece consideración",
    "no olvides revisar",
    "conviene descubrir",
    "es provechoso conocer",
    "te aconsejamos explorar",
    "deberías consultar",
    "vale la pena explorar",
    "es necesario revisar",
    "te animamos a explorar",
    "considera leer",
    "sería conveniente consultar",
    "te proponemos leer",
    "merece tu atención",
]

INFORMATIVAS_Y_EDUCATIVAS = [
    "la guía completa de",
    "todo lo que necesitas saber sobre",
    "los fundamentos de",
    "una introducción a",
    "el manual definitivo de",
    "las bases de",
    "los principios básicos de",
    "una visión general de",
    "el abc de",
    "los conceptos esenciales de",
    "la guía paso a paso de",
    "todo sobre",
    "los pilares de",
    "una mirada profunda a",
    "el compendio de",
    "las claves fundamentales de",
    "los aspectos básicos de",
    "una exploración de",
    "el resumen completo de",
    "los elementos clave de",
    "la guía definitiva para",
    "todo acerca de",
    "los cimientos de",
    "una perspectiva sobre",
    "el manual práctico de",
    "las nociones básicas de",
    "los componentes de",
    "una investigación sobre",
    "el directorio de",
    "los factores importantes de",
    "la guía esencial de",
    "todo relacionado con",
    "los fundamentos básicos de",
    "una revisión de",
    "el curso intensivo de",
    "las características de",
    "los ingredientes de",
    "una evaluación de",
    "el catálogo de",
    "los elementos fundamentales de",
    "la guía práctica de",
    "todo vinculado a",
    "los principios de",
    "una inmersión en",
    "el recurso completo sobre",
    "las particularidades de",
    "los factores clave de",
    "una descripción de",
    "el listado completo de",
    "los aspectos esenciales de",
]

COMPARATIVAS_Y_ANALISIS = [
    "diferencias entre",
    "comparativa de",
    "análisis detallado de",
    "evaluación de",
    "contraste entre",
    "revisión comparativa de",
    "estudio de",
    "valoración de",
    "comparación exhaustiva de",
    "examen de",
    "diferenciación entre",
    "análisis profundo de",
    "evaluación completa de",
    "paralelismo entre",
    "revisión crítica de",
    "investigación sobre",
    "valoración técnica de",
    "comparación detallada de",
    "inspección de",
    "distinción entre",
    "análisis completo de",
    "evaluación objetiva de",
    "similitudes entre",
    "revisión exhaustiva de",
    "estudio comparativo de",
    "valoración experta de",
    "comparación práctica de",
    "diagnóstico de",
    "diferencias clave entre",
    "análisis técnico de",
    "evaluación profesional de",
    "contraste detallado entre",
    "revisión especializada de",
    "estudio profundo de",
    "valoración detallada de",
    "comparación entre",
    "auditoría de",
    "diferencias principales entre",
    "análisis especializado de",
    "evaluación minuciosa de",
]

TEMPORALES_Y_ACTUALIZADOS = [
    "las últimas tendencias en",
    "novedades sobre",
    "actualizaciones de",
    "lo más reciente en",
    "últimas noticias sobre",
    "cambios recientes en",
    "innovaciones en",
    "avances en",
    "nuevas estrategias de",
    "desarrollos actuales en",
    "las tendencias de este año en",
    "últimos avances en",
    "actualizaciones importantes sobre",
    "lo nuevo en",
    "noticias frescas sobre",
    "cambios significativos en",
    "innovaciones recientes en",
    "progresos en",
    "nuevas técnicas de",
    "desarrollos recientes en",
    "las tendencias emergentes en",
    "últimas mejoras en",
    "actualizaciones relevantes sobre",
    "lo más actual en",
    "información reciente sobre",
    "cambios importantes en",
    "innovaciones destacadas en",
    "mejoras en",
    "nuevos enfoques de",
    "desarrollos importantes en",
    "las tendencias futuras en",
    "últimos cambios en",
    "actualizaciones clave sobre",
    "lo destacado en",
    "datos actuales sobre",
    "transformaciones en",
    "innovaciones clave en",
    "evolución de",
    "nuevas perspectivas de",
    "desarrollos significativos en",
]

CONSEJOS_Y_MEJORES_PRACTICAS = [
    "mejores prácticas para",
    "consejos expertos sobre",
    "tips profesionales de",
    "recomendaciones para",
    "estrategias efectivas de",
    "técnicas probadas de",
    "trucos profesionales para",
    "métodos eficaces de",
    "claves para optimizar",
    "soluciones prácticas para",
    "las mejores estrategias de",
    "consejos avanzados sobre",
    "tips imprescindibles de",
    "recomendaciones expertas para",
    "estrategias comprobadas de",
    "técnicas avanzadas de",
    "trucos efectivos para",
    "métodos optimizados de",
    "claves para mejorar",
    "soluciones efectivas para",
    "las mejores técnicas de",
    "consejos prácticos sobre",
    "tips esenciales de",
    "recomendaciones clave para",
    "estrategias inteligentes de",
    "técnicas especializadas de",
    "trucos útiles para",
    "métodos profesionales de",
    "claves para dominar",
    "soluciones inteligentes para",
    "las mejores tácticas de",
    "consejos fundamentales sobre",
    "tips valiosos de",
    "recomendaciones profesionales para",
    "estrategias avanzadas de",
    "técnicas efectivas de",
    "trucos expertos para",
    "métodos especializados de",
    "claves para perfeccionar",
    "soluciones avanzadas para",
]

PROBLEMAS_Y_SOLUCIONES = [
    "cómo resolver problemas de",
    "soluciones para",
    "cómo evitar errores en",
    "fix para problemas de",
    "cómo corregir",
    "troubleshooting de",
    "cómo solucionar",
    "remedios para",
    "cómo prevenir fallos en",
    "respuestas a problemas de",
    "cómo eliminar errores de",
    "soluciones rápidas para",
    "cómo evitar",
    "correcciones para",
    "cómo arreglar",
    "diagnóstico y solución de",
    "cómo resolver",
    "alternativas para problemas de",
    "cómo prevenir",
    "fixes comunes para",
    "cómo superar obstáculos en",
    "soluciones definitivas para",
    "cómo evitar complicaciones en",
    "reparaciones para",
    "cómo solucionar problemas comunes de",
    "workarounds para",
    "cómo resolver issues de",
    "medidas correctivas para",
    "cómo prevenir errores en",
    "soluciones probadas para",
    "cómo eliminar",
    "soluciones efectivas para",
    "cómo evitar dificultades en",
    "parches para",
    "cómo corregir errores de",
    "resolución de problemas de",
    "cómo solucionar inconvenientes de",
    "respuestas efectivas para",
    "cómo prevenir problemas en",
    "soluciones integrales para",
]

HERRAMIENTAS_Y_RECURSOS = [
    "las mejores herramientas para",
    "recursos útiles de",
    "herramientas esenciales de",
    "recursos imprescindibles para",
    "software recomendado para",
    "plataformas ideales de",
    "herramientas profesionales de",
    "recursos avanzados para",
    "aplicaciones útiles de",
    "recursos especializados en",
    "las herramientas más efectivas para",
    "recursos valiosos de",
    "herramientas indispensables de",
    "recursos profesionales para",
    "software especializado en",
    "plataformas recomendadas de",
    "herramientas avanzadas de",
    "recursos esenciales para",
    "aplicaciones profesionales de",
    "recursos técnicos en",
    "las herramientas top para",
    "recursos completos de",
    "herramientas especializadas de",
    "recursos prácticos para",
    "software avanzado para",
    "plataformas especializadas de",
    "herramientas eficaces de",
    "recursos fundamentales para",
    "aplicaciones especializadas de",
    "recursos expertos en",
    "las herramientas clave para",
    "recursos destacados de",
    "herramientas optimizadas de",
    "recursos importantes para",
    "software profesional para",
    "plataformas eficaces de",
    "herramientas prácticas de",
    "recursos necesarios para",
    "aplicaciones avanzadas de",
    "recursos críticos en",
]

CASOS_Y_EJEMPLOS = [
    "ejemplos prácticos de",
    "casos de éxito en",
    "ejemplos reales de",
    "casos de estudio sobre",
    "ejemplos inspiradores de",
    "casos prácticos en",
    "ejemplos detallados de",
    "casos demostrados sobre",
    "ejemplos concretos de",
    "casos verificados en",
    "ejemplos ilustrativos de",
    "casos de aplicación en",
    "ejemplos específicos de",
    "casos documentados sobre",
    "ejemplos comprobados de",
    "casos relevantes en",
    "ejemplos demostrativos de",
    "casos exitosos sobre",
    "ejemplos validados de",
    "casos representativos en",
    "ejemplos efectivos de",
    "casos prácticos sobre",
    "ejemplos aplicados de",
    "casos significativos en",
    "ejemplos funcionales de",
    "casos reales sobre",
    "ejemplos verificados de",
    "casos importantes en",
    "ejemplos probados de",
    "casos destacados sobre",
    "ejemplos profesionales de",
    "casos ejemplares en",
    "ejemplos optimizados de",
    "casos notables sobre",
    "ejemplos especializados de",
    "casos emblemáticos en",
    "ejemplos avanzados de",
    "casos paradigmáticos sobre",
    "ejemplos técnicos de",
    "casos ilustrativos en",
]

PROCESOS_Y_METODOLOGIAS = [
    "el proceso completo de",
    "metodología paso a paso para",
    "el procedimiento de",
    "sistema efectivo de",
    "la estrategia integral de",
    "workflow optimizado para",
    "el método probado de",
    "framework completo de",
    "la estructura de",
    "proceso sistemático de",
    "metodología profesional para",
    "el esquema de",
    "sistema avanzado de",
    "la táctica eficaz de",
    "workflow profesional para",
    "el método especializado de",
    "framework detallado de",
    "la organización de",
    "proceso detallado de",
    "metodología experta para",
    "el plan de",
    "sistema profesional de",
    "la fórmula efectiva de",
    "workflow especializado para",
    "el método avanzado de",
    "framework práctico de",
    "la configuración de",
    "proceso optimizado de",
    "metodología técnica para",
    "el diseño de",
]

RESULTADOS_Y_BENEFICIOS = [
    "beneficios comprobados de",
    "ventajas principales de",
    "resultados efectivos con",
    "impacto positivo de",
    "beneficios directos de",
    "ventajas competitivas de",
    "resultados medibles con",
    "mejoras significativas mediante",
    "beneficios inmediatos de",
    "ventajas clave de",
    "resultados garantizados con",
    "ROI demostrado de",
    "beneficios tangibles de",
    "ventajas estratégicas de",
    "resultados probados con",
    "valor agregado de",
    "beneficios prácticos de",
    "ventajas operativas de",
    "resultados óptimos con",
    "eficiencia mejorada mediante",
    "beneficios sostenibles de",
    "ventajas medibles de",
    "resultados superiores con",
    "productividad aumentada mediante",
    "beneficios verificables de",
    "ventajas demostradas de",
    "resultados consistentes con",
    "rendimiento mejorado mediante",
    "beneficios estratégicos de",
    "ventajas probadas de",
]


ANCHOR_PHRASES = (
    INTRODUCTORIOS_Y_CONTEXTUALES
    + PROFUNDIZACION_Y_AMPLIFICACION
    + ACCION_Y_RECOMENDACION
    + INFORMATIVAS_Y_EDUCATIVAS
    + COMPARATIVAS_Y_ANALISIS
    + TEMPORALES_Y_ACTUALIZADOS
    + CONSEJOS_Y_MEJORES_PRACTICAS
    + PROBLEMAS_Y_SOLUCIONES
    + HERRAMIENTAS_Y_RECURSOS
    + CASOS_Y_EJEMPLOS
    + PROCESOS_Y_METODOLOGIAS
    + RESULTADOS_Y_BENEFICIOS
)


FRONTMATTER_RE = re.compile(r"\A---\s*\n(.*?)\n---\s*\n", re.DOTALL)
MD_LINK_RE = re.compile(r"\[[^\]]*\]\((/blog/[^)\s]+)\)")
MD_ANY_LINK_RE = re.compile(r"(?<!\!)\[([^\]]+)\]\(([^)]+)\)")
MD_REF_LINK_RE = re.compile(r"(?<!\!)\[([^\]]+)\]\[([^\]]+)\]")
MD_REF_DEF_RE = re.compile(r"^\s*\[([^\]]+)\]:\s*\S+\s*$", re.MULTILINE)


@dataclass(frozen=True)
class BlogPost:
    slug: str
    title: str
    path: str


def _extract_frontmatter(md: str) -> Tuple[Optional[str], str]:
    m = FRONTMATTER_RE.search(md)
    if not m:
        return None, md
    return m.group(0), md[m.end() :]


def _extract_title_from_frontmatter(frontmatter_block: Optional[str]) -> str:
    if not frontmatter_block:
        return "(sin título)"
    for line in frontmatter_block.splitlines():
        s = line.strip()
        if s.lower().startswith("title:"):
            value = s.split(":", 1)[1].strip()
            if len(value) >= 2 and ((value[0] == value[-1] == "'") or (value[0] == value[-1] == '"')):
                value = value[1:-1]
            return value
    return "(sin título)"


def list_blog_posts(blog_dir: str) -> List[BlogPost]:
    posts: List[BlogPost] = []
    if not os.path.isdir(blog_dir):
        return posts

    for name in sorted(os.listdir(blog_dir)):
        if not (name.endswith(".md") or name.endswith(".mdx")):
            continue
        slug = os.path.splitext(name)[0]
        path = os.path.join(blog_dir, name)
        try:
            with open(path, "r", encoding="utf-8") as f:
                md = f.read()
        except OSError:
            continue

        frontmatter, _ = _extract_frontmatter(md)
        title = _extract_title_from_frontmatter(frontmatter)
        posts.append(BlogPost(slug=slug, title=title, path=path))

    return posts


def _is_candidate_paragraph(block: str) -> bool:
    s = block.strip()
    if not s:
        return False


def _topic_templates_for_target(target: "BlogPost") -> List[str]:
    s = (target.slug or "").lower()
    t = (target.title or "").lower()
    hay = f"{s} {t}"

    if "mejores-agencias" in hay or "servicio-seo" in hay or "agencias" in hay:
        return [
            "Para servicios SEO, revisa",
            "Si buscas agencias SEO, mira",
            "Para comparar agencias, consulta",
        ]
    if "seo" in hay and "dise" in hay:
        return [
            "Para mejorar tu SEO, revisa",
            "Para optimizar tu web, te recomiendo",
            "Si construyes web con SEO, consulta",
        ]
    if "backlink" in hay:
        return [
            "Para conseguir backlinks, revisa",
            "Para entender enlaces, te recomiendo",
            "Si trabajas linkbuilding, consulta",
        ]
    if "autoridad" in hay or "dominio" in hay:
        return [
            "Para medir tu autoridad, revisa",
            "Para entender autoridad de dominio, consulta",
            "Para evaluar tu dominio, mira",
        ]
    if "posicionar" in hay or "primeros-lugares" in hay:
        return [
            "Para posicionar tu web, revisa",
            "Para subir en Google, te recomiendo",
            "Para guías de posicionamiento, consulta",
        ]
    if "errores" in hay and "dise" in hay:
        return [
            "Para evitar errores SEO, revisa",
            "Para corregir errores de diseño, te recomiendo",
            "Si tu web no convierte, consulta",
        ]
    if "freelance" in hay and "dise" in hay:
        return [
            "Para contratar diseñador freelance, revisa",
            "Para elegir diseñador web, te recomiendo",
            "Si buscas guía de diseño, consulta",
        ]

    return [
        "Te recomiendo leer",
        "Para profundizar, revisa",
        "Para ampliar, consulta",
    ]


def _pick_contextual_phrase(md: str, used_phrases: set, target: "BlogPost") -> str:
    templates = _topic_templates_for_target(target)
    available = [p for p in templates if p not in used_phrases and p not in md]
    if not available:
        available = [p for p in templates if p not in used_phrases]
    if not available:
        raise RuntimeError("No hay frases contextuales disponibles para este destino.")
    return random.choice(available)


def _is_candidate_paragraph(block: str) -> bool:
    s = block.strip()
    if not s:
        return False
    if "\n" in s:
        return False
    if s.startswith("¿") and s.endswith("?"):
        return False
    if len(s) < 40:
        return False
    if "![" in s:
        return False
    if "##" in s or "###" in s:
        return False
    if re.fullmatch(r"\*\*[^*]+\*\*:?", s):
        return False
    if re.search(r"^\s*[-*+]\s+", block, flags=re.MULTILINE):
        return False
    if re.search(r"^\s*\d+\.\s+", block, flags=re.MULTILINE):
        return False
    if re.search(r"^\s*\|.*\|\s*$", block, flags=re.MULTILINE):
        return False
    if s.startswith("#"):
        return False
    if s.startswith(">"):
        return False
    if s.startswith("```"):
        return False
    if s.startswith("!"):
        return False
    if "|" in s and "---" in s:
        return False
    if "[](" in s:
        return True
    return True


def _split_blocks(body_md: str) -> List[str]:
    parts = re.split(r"\n\s*\n", body_md.strip("\n"))
    return parts


def _join_blocks(blocks: List[str], trailing_newlines: str) -> str:
    result = "\n\n".join(blocks)
    if trailing_newlines:
        result += trailing_newlines
    return result


def _get_trailing_newlines(s: str) -> str:
    m = re.search(r"\n+\Z", s)
    return m.group(0) if m else ""


def _existing_blog_links(md: str) -> set:
    return set(MD_LINK_RE.findall(md))


def remove_all_markdown_links(md: str) -> str:
    frontmatter, body = _extract_frontmatter(md)
    if frontmatter is None:
        frontmatter = ""

    trailing_newlines = _get_trailing_newlines(body)
    core = body.rstrip("\n")

    core = MD_REF_DEF_RE.sub("", core)
    core = MD_ANY_LINK_RE.sub(r"\1", core)
    core = MD_REF_LINK_RE.sub(r"\1", core)

    core = re.sub(r"\n{3,}", "\n\n", core)
    return frontmatter + core + trailing_newlines


def _is_coherent_anchor_phrase(phrase: str) -> bool:
    p = phrase.strip()
    if not p:
        return False

    # Prefer phrases that naturally connect to a title link: "... de [Título]", "... sobre [Título]", etc.
    last = re.split(r"\s+", p)[-1].lower()
    connector_last_words = {
        "de",
        "del",
        "sobre",
        "en",
        "para",
        "con",
        "entre",
        "al",
        "a",
    }
    if last in connector_last_words:
        return True

    # Allow imperative/neutral lead-ins that work without a connector.
    starts_ok = (
        "lee",
        "revisa",
        "consulta",
        "descubre",
        "explora",
        "aprende",
        "conoce",
        "mira",
        "te recomiendo leer",
        "te sugiero revisar",
        "te proponemos leer",
        "si quieres aprender",
        "si necesitas",
    )
    pl = p.lower()
    if any(pl.startswith(s) for s in starts_ok):
        return True

    return False


def cleanup_orphan_anchor_phrases(md: str, posts: List[BlogPost]) -> str:
    frontmatter, body = _extract_frontmatter(md)
    if frontmatter is None:
        frontmatter = ""

    trailing_newlines = _get_trailing_newlines(body)
    core = body.rstrip("\n")

    phrases_pattern = "|".join(sorted({re.escape(p) for p in ANCHOR_PHRASES}, key=len, reverse=True))
    if not phrases_pattern:
        return md

    titles_pattern = "|".join(sorted({re.escape(p.title) for p in posts if p.title}, key=len, reverse=True))
    if not titles_pattern:
        return md

    orphan_re = re.compile(
        rf"(?:^|(?<=[.!?:]\s))\s*(?P<phrase>{phrases_pattern})\s+(?P<title>{titles_pattern})\.\s*",
        re.IGNORECASE | re.MULTILINE,
    )

    core = orphan_re.sub("", core)
    core = re.sub(r"\n{3,}", "\n\n", core)
    return frontmatter + core + trailing_newlines


def _pick_unique_anchor_phrase(md: str, used_phrases: set) -> str:
    available = [
        p
        for p in ANCHOR_PHRASES
        if p not in used_phrases and p not in md and _is_coherent_anchor_phrase(p)
    ]
    if not available:
        raise RuntimeError(
            "No hay anchor texts coherentes disponibles (todos ya usados o presentes en el artículo)."
        )
    return random.choice(available)


def insert_internal_links(
    md: str,
    targets: List[BlogPost],
    links_to_add: int,
) -> str:
    frontmatter, body = _extract_frontmatter(md)
    if frontmatter is None:
        frontmatter = ""

    existing_links = _existing_blog_links(md)
    remaining_targets = [t for t in targets if f"/blog/{t.slug}" not in existing_links]

    if links_to_add <= 0:
        return md

    if len(remaining_targets) < links_to_add:
        raise RuntimeError(
            f"No hay suficientes artículos destino sin repetir enlace. Disponibles: {len(remaining_targets)}, solicitados: {links_to_add}."
        )

    trailing_newlines = _get_trailing_newlines(body)
    blocks = _split_blocks(body)

    candidate_idxs = [i for i, b in enumerate(blocks) if _is_candidate_paragraph(b)]

    # Do not insert links in the intro: start from the 3rd paragraph or later.
    # We skip the first 2 blocks always, plus a small random offset.
    min_intro_skip = 2
    extra_skip = random.randint(0, 2)
    intro_skip = min_intro_skip + extra_skip
    candidate_idxs = [i for i in candidate_idxs if i >= intro_skip]
    if len(candidate_idxs) < links_to_add:
        raise RuntimeError(
            f"No encontré suficientes párrafos válidos para insertar {links_to_add} enlaces. "
            f"Encontré {len(candidate_idxs)} párrafos candidatos."
        )

    min_gap = 3
    random.shuffle(candidate_idxs)
    chosen_paragraph_idxs: List[int] = []
    for idx in candidate_idxs:
        if all(abs(idx - chosen) >= min_gap for chosen in chosen_paragraph_idxs):
            chosen_paragraph_idxs.append(idx)
            if len(chosen_paragraph_idxs) >= links_to_add:
                break

    if len(chosen_paragraph_idxs) < links_to_add:
        raise RuntimeError(
            f"No encontré suficientes párrafos válidos con separación mínima de {min_gap} para insertar {links_to_add} enlaces."
        )

    used_phrases: set = set()
    used_targets: set = set()
    random.shuffle(remaining_targets)

    for i in range(links_to_add):
        target = remaining_targets[i]
        url = f"/blog/{target.slug}"
        if url in used_targets:
            continue

        contextual = _pick_contextual_phrase(md, used_phrases, target)
        used_phrases.add(contextual)
        used_targets.add(url)

        idx = chosen_paragraph_idxs[i]
        paragraph = blocks[idx].rstrip()
        link = f"[{target.title}]({url})"

        last_char = paragraph[-1] if paragraph else ""
        phrase_formatted = contextual[:1].upper() + contextual[1:]

        if last_char in ".!?:":
            insertion = f" {phrase_formatted} {link}."
        else:
            insertion = f". {phrase_formatted} {link}."
        blocks[idx] = paragraph + insertion

    new_body = _join_blocks(blocks, trailing_newlines)
    return frontmatter + new_body


def choose_post_menu(posts: List[BlogPost]) -> BlogPost:
    if not posts:
        raise RuntimeError(f"No encontré artículos en: {BLOG_DIR}")

    print("\nArtículos disponibles:\n")
    for i, p in enumerate(posts, start=1):
        print(f"{i}. {p.title} ({p.slug})")

    while True:
        raw = input("\nSelecciona el número del artículo a editar: ").strip()
        if not raw.isdigit():
            print("Ingresa un número válido.")
            continue
        n = int(raw)
        if 1 <= n <= len(posts):
            return posts[n - 1]
        print("Número fuera de rango.")


def _find_post_by_slug(posts: List[BlogPost], slug: str) -> BlogPost:
    for p in posts:
        if p.slug == slug:
            return p
    raise RuntimeError(f"No encontré el artículo con slug: {slug}")


def ask_int(prompt: str, min_value: int, max_value: int) -> int:
    while True:
        raw = input(prompt).strip()
        if not raw.isdigit():
            print("Ingresa un número válido.")
            continue
        n = int(raw)
        if n < min_value:
            print(f"El número mínimo es {min_value}.")
            continue
        if n > max_value:
            print(f"El número máximo es {max_value}.")
            continue
        return n


def _parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Inserta enlaces internos en posts del blog sin repetir anchors ni URLs.")
    parser.add_argument("--slug", type=str, help="Slug del post a editar (ej: algoritmo-de-google)")
    parser.add_argument("--links", type=int, help="Cantidad de enlaces internos a insertar")
    parser.add_argument(
        "--remove-all-links",
        action="store_true",
        help="Elimina todos los enlaces Markdown del artículo (mantiene el texto; no toca imágenes).",
    )
    parser.add_argument(
        "--cleanup-orphan-anchors",
        action="store_true",
        help="Al eliminar enlaces, también elimina frases tipo anchor que quedaron como texto suelto.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="No escribe el archivo; solo muestra un resumen de lo que haría.",
    )
    return parser.parse_args()


def main() -> None:
    random.seed()

    args = _parse_args()

    posts = list_blog_posts(BLOG_DIR)
    if args.slug:
        selected = _find_post_by_slug(posts, args.slug)
    else:
        selected = choose_post_menu(posts)

    targets = [p for p in posts if p.slug != selected.slug]

    try:
        with open(selected.path, "r", encoding="utf-8") as f:
            md = f.read()
    except OSError as e:
        raise RuntimeError(f"No pude leer el archivo: {selected.path}") from e

    if args.remove_all_links:
        new_md = remove_all_markdown_links(md)
        if args.cleanup_orphan_anchors:
            new_md = cleanup_orphan_anchor_phrases(new_md, posts)

        if new_md == md:
            print("\nNo se realizaron cambios.")
            return

        if args.dry_run:
            print(f"\nDRY RUN: Eliminaría enlaces Markdown en: {selected.path}")
            return

        try:
            with open(selected.path, "w", encoding="utf-8", newline="\n") as f:
                f.write(new_md)
        except OSError as e:
            raise RuntimeError(f"No pude escribir el archivo: {selected.path}") from e

        print(f"\nListo. Eliminé enlaces Markdown en: {selected.path}")
        return

    existing_links = _existing_blog_links(md)
    available_targets = [t for t in targets if f"/blog/{t.slug}" not in existing_links]

    max_links = min(len(available_targets), len(ANCHOR_PHRASES))
    if max_links <= 0:
        raise RuntimeError("No hay enlaces disponibles para insertar (o ya están todos enlazados).")

    if args.links is not None:
        if args.links < 1 or args.links > max_links:
            raise RuntimeError(f"--links debe estar entre 1 y {max_links}.")
        links_to_add = args.links
    else:
        links_to_add = ask_int(
            f"\n¿Cuántos enlaces internos quieres insertar? (1-{max_links}): ",
            min_value=1,
            max_value=max_links,
        )

    new_md = insert_internal_links(md=md, targets=targets, links_to_add=links_to_add)

    if new_md == md:
        print("\nNo se realizaron cambios.")
        return

    if args.dry_run:
        added = links_to_add
        print(f"\nDRY RUN: Insertaría {added} enlaces internos en: {selected.path}")
        return

    try:
        with open(selected.path, "w", encoding="utf-8", newline="\n") as f:
            f.write(new_md)
    except OSError as e:
        raise RuntimeError(f"No pude escribir el archivo: {selected.path}") from e

    print(f"\nListo. Inserté {links_to_add} enlaces internos en: {selected.path}")


if __name__ == "__main__":
    main()
