---
title: 'UseEffect Te Está Destruyendo El Rendimiento: 5 Errores'
description: 'Cada useEffect mal colocado genera re-renders innecesarios, fetch duplicados y bloqueo del hilo principal en React. Identifica los 5 patrones más comunes de useEffect mal usado con código antes y después, y mide el impacto real en INP.'
keywords: 'useeffect lento react rendimiento, re-renders innecesarios react, effect mal usado patrones, react web lenta por useEffect, optimizar re-renders react hooks, inp alto por useEffect react'
relatedGroup: 'frameworks'
pubDate: '2026-05-05T12:00:00-05:00'
heroImageUrl: '/assets/blog/useeffect-mal-usado-destruye-rendimiento-react-hero.jpg'
---

Tu aplicación React funciona correctamente, pero cada interacción se siente pesada. El hover sobre un botón tiene un delay visible, el scroll se traba momentáneamente al cargar una lista, y el input de búsqueda tarda más de lo esperado en reflejar lo que el usuario escribe. Abres las DevTools de React y ves que los componentes se re-renderizan constantemente sin que los datos hayan cambiado. La causa más probable no es un problema de estado global ni de bundle size. Es useEffect.

useEffect es el hook más utilizado y más mal entendido de React. La documentación oficial advierte sobre sus riesgos, pero la mayoría de los tutoriales lo presentan como la solución universal para cualquier efecto secundario: fetch de datos, suscripciones, manipulación del DOM, timers, logging. Cada uno de esos casos es válido, pero la diferencia entre un useEffect bien colocado y uno mal ejecutado es la diferencia entre una aplicación fluida y una que bloquea el hilo principal del navegador. Este artículo muestra los cinco patrones de useEffect mal uso más comunes, el código exacto del antes y después, y el impacto medible que cada uno tiene en las métricas de rendimiento.

## Por qué useEffect es tan problemático cuando se usa mal

useEffect se ejecuta después del render del componente. Eso significa que cada vez que el componente se re-renderiza, el efecto correspondiente se evalúa. Si el efecto contiene operaciones costosas como fetch de datos, cálculos pesados o manipulación del DOM, cada re-render innecesario ejecuta esas operaciones de nuevo. El resultado es un ciclo vicioso: el efecto causa re-renders, los re-renders ejecutan el efecto, y la aplicación se degrada progresivamente.

React 18 y el modo concurrente empeoran el problema cuando useEffect no se configura correctamente. Los re-renders que antes eran síncronos ahora pueden interrumpirse y continuarse, lo que amplifica el impacto de efectos mal colocado en la métrica de Interaction to Next Paint. INP mide cuánto tiempo tarda la aplicación en responder a una interacción del usuario. Un useEffect que ejecuta un fetch innecesario durante una interacción puede causar un INP de varios segundos.

## Patrón 1: useEffect para fetch de datos sin dependency array

El error más frecuentemente encontrado en código React producción es un useEffect que ejecuta fetch en cada render sin un dependency array:

```javascript
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => setUser(data));
  });
  // Sin dependency array: se ejecuta en CADA render
}
```

Cada vez que el componente se re-renderiza, por cualquier razón, se dispara una nueva petición de red. Si el componente padre se re-renderiza porque cambió un estado irrelevante, el fetch se ejecuta de nuevo. Con 10 componentes en pantalla que tengan este patrón, puedes generar decenas de peticiones de red innecesarias en cada ciclo de render.

### La corrección

```javascript
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => setUser(data));
  }, [userId]);
  // Solo se ejecuta cuando userId cambia
}
```

El dependency array `[userId]` le dice a React que solo ejecute el efecto cuando el valor de userId cambia. Si userId se mantiene igual a través de los re-renders, el fetch no se ejecuta. Eso elimina las peticiones duplicadas y reduce el tráfico de red innecesario.

## Patrón 2: useEffect que causa re-renders en cadena

Este patrón ocurre cuando un useEffect actualiza un estado que dispara otro useEffect, creando una cadena de renders que nunca se estabiliza:

```javascript
function Dashboard() {
  const [filters, setFilters] = useState({});
  const [data, setData] = useState([]);
  const [sorted, setSorted] = useState([]);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(raw => setData(raw));
  }, [filters]);

  useEffect(() => {
    setSorted([...data].sort((a, b) => a.name.localeCompare(b.name)));
  }, [data]);

  useEffect(() => {
    fetch('/api/analytics', { method: 'POST', body: JSON.stringify(sorted) });
  }, [sorted]);
}
```

Cada useEffect desencadena el siguiente. Cuando filters cambia, el primer useEffect ejecuta un fetch. La respuesta actualiza data, lo que ejecuta el segundo useEffect que ordena y actualiza sorted. Eso ejecuta el tercer useEffect que hace otro fetch. Tres peticiones de red en cadena por cada cambio de filtro, y dos re-renders intermedios innecesarios.

### La corrección

Consolida los tres useEffect en uno solo o elimina los estados intermedios:

```javascript
function Dashboard() {
  const [filters, setFilters] = useState({});
  const [sorted, setSorted] = useState([]);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/data')
      .then(res => res.json())
      .then(raw => {
        if (cancelled) return;
        const ordered = raw.sort((a, b) => a.name.localeCompare(b.name));
        setSorted(ordered);
        fetch('/api/analytics', { method: 'POST', body: JSON.stringify(ordered) });
      });
    return () => { cancelled = true; };
  }, [filters]);
}
```

Un solo useEffect, un solo ciclo de fetch, y un estado menos que actualizar. La función de limpieza con `cancelled` evita actualizaciones de estado en componentes desmontados.

## Patrón 3: useEffect para manipulación del DOM que React ya maneja

Muchos desarrolladores usan useEffect para sincronizar propiedades del DOM que React puede controlar directamente:

```javascript
function Modal({ isOpen, title, content }) {
  const titleRef = useRef(null);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.textContent = title;
    }
  }, [title]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }, [isOpen]);
}
```

El primer useEffect manipula `textContent` directamente, algo que React maneja declarativamente. El segundo useEffect modifica el body cuando el modal abre o cierra, lo cual es válido pero se ejecuta en cada render si isOpen no cambia de forma estable.

### La corrección

```javascript
function Modal({ isOpen, title, content }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  return (
    <div className={isOpen ? 'modal open' : 'modal closed'}>
      <h2>{title}</h2>
      <p>{content}</p>
    </div>
  );
}
```

Elimina la manipulación innecesaria del título y usa el return de la función de limpieza para restaurar el estilo anterior. Eso evita el bug común donde el body queda con overflow hidden después de que el componente se desmonta.

## Patrón 4: useEffect sin limpieza de suscripciones

Este patrón genera memory leaks que degradan el rendimiento progresivamente:

```javascript
function LiveFeed() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const socket = new WebSocket('wss://api.example.com/feed');
    socket.onmessage = (event) => {
      setMessages(prev => [...prev, JSON.parse(event.data)]);
    };
  }, []);
  // El socket nunca se cierra
}
```

Cada vez que el componente se monta, se abre una nueva conexión WebSocket. Si el componente se monta y desmonta varias veces (por ejemplo, en una SPA con navegación), las conexiones anteriores nunca se cierran. El navegador mantiene todas las conexiones abiertas, consumiendo memoria y ancho de banda.

### La corrección

```javascript
function LiveFeed() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const socket = new WebSocket('wss://api.example.com/feed');
    socket.onmessage = (event) => {
      setMessages(prev => [...prev, JSON.parse(event.data)]);
    };
    return () => {
      socket.close();
    };
  }, []);
}
```

La función de limpieza se ejecuta cuando el componente se desmonta. Eso cierra la conexión WebSocket y libera los recursos. Sin esa limpieza, cada ciclo de montaje-desmontaje acumula conexiones abiertas.

## Patrón 5: useEffect que bloquea el hilo principal

Este es el patrón más destructivo para INP. Un useEffect que ejecuta cálculos pesados bloquea el hilo principal del navegador:

```javascript
function DataGrid({ rows }) {
  const [processed, setProcessed] = useState([]);

  useEffect(() => {
    const result = rows.map(row => {
      const enriched = { ...row };
      enriched.score = calculateComplexScore(row);
      enriched.formatted = formatCurrency(enriched.score);
      enriched.tooltip = generateTooltip(enriched);
      return enriched;
    });
    setProcessed(result);
  }, [rows]);
}
```

Si rows tiene miles de elementos, el cálculo puede tomar cientos de milisegundos. Durante ese tiempo, el navegador no puede responder a clics, typing ni scrolls. El INP de la página salta de 200ms a más de 2 segundos.

### La corrección

```javascript
function DataGrid({ rows }) {
  const [processed, setProcessed] = useState([]);

  useEffect(() => {
    let cancelled = false;
    const chunkSize = 100;

    function processChunk(start) {
      if (cancelled || start >= rows.length) return;
      const end = Math.min(start + chunkSize, rows.length);
      const chunk = rows.slice(start, end).map(row => ({
        ...row,
        score: calculateComplexScore(row),
        formatted: formatCurrency(calculateComplexScore(row)),
        tooltip: generateTooltip(row),
      }));
      setProcessed(prev => [...prev, ...chunk]);
      requestAnimationFrame(() => processChunk(end));
    }

    processChunk(0);
    return () => { cancelled = true; };
  }, [rows]);
}
```

El procesamiento por chunks con requestAnimationFrame divide el trabajo en bloques que el navegador puede intercalar con la atención de interacciones del usuario. Cada chunk toma menos de 16ms, manteniendo el INP estable incluso con miles de filas.

## Cómo medir el impacto en INP

La métrica de Interaction to Next Paint mide la latencia de respuesta del navegador a interacciones del usuario. Si tu aplicación tiene un INP alto, abre Chrome DevTools, ve a la pestaña de Performance y graba una sesión mientras interactúas con la página. Los long tasks que aparecen en el flame chart muestran exactamente qué useEffect está bloqueando el hilo principal.

Para monitorear INP en producción, usa la librería web-vitals que reporta las métricas de Core Web Vitals:

```javascript
import { onINP } from 'web-vitals';

onINP(({ value, rating }) => {
  if (rating === 'poor') {
    console.warn(`INP alto: ${value}ms`);
  }
});
```

Cada mejora en useEffect se refleja directamente en una reducción de INP. La eliminación de fetch duplicados, la consolidación de useEffect en cadena y el procesamiento por chunks son las tres optimizaciones con mayor impacto medible.

## Checklist de revisión para tu código React

- Verifica que cada useEffect tenga un dependency array definido
- Busca useEffect que ejecuten fetch sin dependency array o con array vacío innecesario
- Revisa si hay cadenas de useEffect donde uno actualiza el estado que dispara otro
- Elimina useEffect que manipulen propiedades del DOM que React controla declarativamente
- Confirma que todos los useEffect con suscripciones, sockets o timers tengan función de limpieza
- Mide el tiempo de ejecución de cada useEffect con console.time en desarrollo
- Monitorea INP en producción para detectar bloqueos del hilo principal

## Conclusión

useEffect es una herramienta poderosa pero peligrosa cuando se usa como solución por defecto para cualquier efecto secundario. Cada patrón mal ejecutado tiene un costo real en rendimiento: fetch duplicados que congestiona la red, re-renders innecesarios que consumen CPU, suscripciones sin limpieza que acumulan memoria, y cálculos pesados que bloquean la respuesta del navegador.

Los cinco patrones mostrados representan la mayoría de los casos de useEffect mal uso que encontrarás en código React producción. Detectarlos es cuestión de revisar tu código con los dependency arrays correctos y medir el impacto con las DevTools de React y la métrica de INP. Las correcciones son específicas y cada una tiene un efecto inmediato y medible en el rendimiento de tu aplicación.

No necesitas reescribir toda tu aplicación. Identifica los useEffect problemáticos, aplica las correcciones correspondientes y mide la diferencia en INP antes y después. Tu aplicación se va a sentir más fluida, tus usuarios van a notar la diferencia, y las métricas de Core Web Vitals van a reflejar una mejora real.

## Preguntas frecuentes

**¿Debería evitar useEffect completamente en React?**

No. useEffect es esencial para manejar suscripciones, timers, manipulación del DOM que React no puede controlar declarativamente, y sincronización con sistemas externos. El problema no es useEffect en sí, sino usarlo como solución por defecto para casos donde React ofrece alternativas más eficientes como useMemo, useCallback o el manejo declarativo del estado.

**¿Cómo sé si un useEffect específico está causando re-renders innecesarios?**

Instala React DevTools y activa el "Highlight Updates" en la pestaña de componentes. Si ves que un componente se resalta constantemente sin cambios visibles, revisa los useEffect de ese componente. Usa la pestaña de Profiler para grabar una sesión y identificar qué componentes se re-renderizan con más frecuencia de la esperada.

**¿useEffect con dependency array vacío siempre es un error?**

No necesariamente. Un useEffect con `[]` se ejecuta una sola vez después del montaje, lo cual es correcto para inicializar suscripciones o cargar datos iniciales. El error es cuando el efecto debería re-ejecutarse con cambios de props pero el array vacío previene eso. La regla es: el dependency array debe contener todas las propiedades externas que el efecto utiliza.

**¿Qué diferencia hay entre useEffect y useLayoutEffect para rendimiento?**

useLayoutEffect se ejecuta de forma síncrona después del render pero antes de que el navegador pinte. Eso bloquea el pintado hasta que el efecto termine. useEffect se ejecuta de forma asíncrona después de que el navegador ha pintado. Para efectos que necesitan medir el layout del DOM o hacer manipulaciones visibles antes de que el usuario vea la página, useLayoutEffect es más apropiado. Para todo lo demás, useEffect es la opción correcta porque no bloquea el pintado.

**¿Cómo afecta useEffect mal usado al Core Web Vitals en producción?**

useEffect mal uso impacta directamente INP porque bloquea el hilo principal durante interacciones. También afecta LCP si el efecto ejecuta fetch de datos que son necesarios para el render inicial del contenido más grande. FCP puede afectarse si los fetch innecesarios compiten por ancho de banda con los recursos críticos de la página. Cada métrica de Core Web Vitals tiene una relación directa con la eficiencia de los useEffect en tu aplicación.