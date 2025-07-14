// ----- MATERIAS Y RELACIONES -----

const materias = [
  // CBC
  { nombre: "Int. al Pensamiento Científico", id: "pensamiento", ciclo: "cbc", tipo: "C", correlativas: ["anatomia", "histologia", "embriologia", "genetica", "saludmental", "saludpublica", "bioetica", "ingles"] },
  { nombre: "Int. al Conocimiento de la Sociedad y el Estado", id: "sociedad", ciclo: "cbc", tipo: "C", correlativas: ["anatomia", "histologia", "embriologia", "genetica", "saludmental", "saludpublica", "bioetica", "ingles"] },
  { nombre: "Química", id: "quimica", ciclo: "cbc", tipo: "C", correlativas: ["anatomia", "histologia", "embriologia", "genetica", "saludmental", "saludpublica", "bioetica", "ingles"] },
  { nombre: "Biofísica", id: "biofisica_cbc", ciclo: "cbc", tipo: "C", correlativas: ["anatomia", "histologia", "embriologia", "genetica"] },
  { nombre: "Biología Celular", id: "biocelular", ciclo: "cbc", tipo: "C", correlativas: ["anatomia", "histologia", "embriologia", "genetica"] },
  { nombre: "Matemática", id: "matematica", ciclo: "cbc", tipo: "C", correlativas: ["anatomia", "histologia", "embriologia", "genetica"] },

  // Biomédico - 1er año
  { nombre: "Anatomía", id: "anatomia", ciclo: "biomedico", tipo: "A", correlativas: ["fisiologia", "bioquimica", "inmunologia"], prereq: ["cbc"] },
  { nombre: "Histología", id: "histologia", ciclo: "biomedico", tipo: "C", correlativas: ["fisiologia", "bioquimica", "inmunologia"], prereq: ["cbc"] },
  { nombre: "Embriología", id: "embriologia", ciclo: "biomedico", tipo: "C", correlativas: ["fisiologia", "bioquimica", "inmunologia"], prereq: ["cbc"] },
  { nombre: "Genética", id: "genetica", ciclo: "biomedico", tipo: "C", correlativas: ["fisiologia", "bioquimica", "inmunologia"], prereq: ["cbc"] },

  // Biomédico - 2do año
  { nombre: "Fisiología y Biofísica", id: "fisiologia", ciclo: "biomedico", tipo: "A", correlativas: ["medicinaA", "patologia", "farmaco1", "legal"], prereq: ["anatomia", "histologia", "embriologia", "genetica"] },
  { nombre: "Bioquímica", id: "bioquimica", ciclo: "biomedico", tipo: "C", correlativas: ["microbiologia", "medicinaA", "patologia", "farmaco1", "legal"], prereq: ["anatomia", "histologia", "embriologia", "genetica"] },
  { nombre: "Inmunología", id: "inmunologia", ciclo: "biomedico", tipo: "C", correlativas: ["microbiologia", "medicinaA", "patologia", "farmaco1", "legal"], prereq: ["anatomia", "histologia", "embriologia", "genetica"] },
  { nombre: "Microbiología", id: "microbiologia", ciclo: "biomedico", tipo: "C", correlativas: ["medicinaA", "patologia", "farmaco1", "legal"], prereq: ["fisiologia", "bioquimica", "inmunologia"] },

  // Clínico
  { nombre: "Medicina A", id: "medicinaA", ciclo: "clinico", tipo: "A", correlativas: ["legal", "toxico", "farmaco2"], prereq: ["fisiologia", "bioquimica", "inmunologia", "microbiologia"] },
  { nombre: "Patología", id: "patologia", ciclo: "clinico", tipo: "A", correlativas: ["legal", "toxico", "farmaco2"], prereq: ["fisiologia", "bioquimica", "inmunologia", "microbiologia"] },
  { nombre: "Farmacología I", id: "farmaco1", ciclo: "clinico", tipo: "A", correlativas: ["legal", "toxico", "farmaco2"], prereq: ["fisiologia", "bioquimica", "inmunologia", "microbiologia"] },
  { nombre: "Medicina Legal y Deontología Médica", id: "legal", ciclo: "clinico", tipo: "A", correlativas: [], prereq: ["medicinaA", "patologia", "farmaco1"] },
  { nombre: "Toxicología", id: "toxico", ciclo: "clinico", tipo: "A", correlativas: [], prereq: ["medicinaA", "patologia", "farmaco1"] },
  { nombre: "Farmacología II", id: "farmaco2", ciclo: "clinico", tipo: "A", correlativas: [], prereq: ["medicinaA", "patologia", "farmaco1"] },

  // Transversales
  { nombre: "Salud Mental", id: "saludmental", ciclo: "transversales", tipo: "C", correlativas: [] },
  { nombre: "Salud Pública", id: "saludpublica", ciclo: "transversales", tipo: "C", correlativas: [] },
  { nombre: "Bioética", id: "bioetica", ciclo: "transversales", tipo: "C", correlativas: [] },
  { nombre: "Inglés Técnico", id: "ingles", ciclo: "transversales", tipo: "C", correlativas: [] },

  // PFO (simplificado)
  { nombre: "Práctica Final Obligatoria", id: "pfo", ciclo: "pfo", tipo: "A", correlativas: [], prereq: ["clinico", "saludmental", "saludpublica", "bioetica", "ingles"] }
];

// ----- ESTADOS CON LOCAL STORAGE -----

const estadoMaterias = JSON.parse(localStorage.getItem('estadoMaterias')) || {};
const notasMaterias = JSON.parse(localStorage.getItem('notasMaterias')) || {};

// ----- RENDER -----

function renderMalla() {
  const secciones = {
    cbc: document.getElementById('cbc'),
    biomedico: document.getElementById('biomedico'),
    clinico: document.getElementById('clinico'),
    transversales: document.getElementById('transversales'),
    pfo: document.getElementById('pfo'),
  };

  Object.values(secciones).forEach(s => s.innerHTML = '');

  materias.forEach(materia => {
    const card = document.createElement('div');
    card.className = 'card';

    // Verifica requisitos
    let bloqueada = false;

    if (materia.prereq) {
      materia.prereq.forEach(req => {
        if (req === "cbc") {
          const todosCBC = materias.filter(m => m.ciclo === "cbc").every(m => estadoMaterias[m.id]);
          if (!todosCBC) bloqueada = true;
        } else if (req === "clinico") {
          const todosClinico = materias.filter(m => m.ciclo === "clinico").every(m => estadoMaterias[m.id]);
          if (!todosClinico) bloqueada = true;
        } else if (!estadoMaterias[req]) {
          bloqueada = true;
        }
      });
    }

    if (bloqueada && !estadoMaterias[materia.id]) {
      card.classList.add('bloqueada');
    }

    if (estadoMaterias[materia.id]) {
      card.classList.add('aprobada');
    }

    const nombre = document.createElement('div');
    nombre.innerText = materia.nombre;

    const tipo = document.createElement('span');
    tipo.className = 'tipo';
    tipo.innerText = materia.tipo === "A" ? "(A)" : "(C)";

    const nota = document.createElement('input');
    nota.type = 'number';
    nota.placeholder = 'Nota';
    nota.value = notasMaterias[materia.id] || '';

    nota.addEventListener('click', e => e.stopPropagation());
    nota.addEventListener('input', () => {
      notasMaterias[materia.id] = nota.value;
      localStorage.setItem('notasMaterias', JSON.stringify(notasMaterias));
    });

    card.appendChild(nombre);
    card.appendChild(tipo);
    card.appendChild(nota);

    if (!bloqueada) {
      card.addEventListener('click', () => {
        estadoMaterias[materia.id] = !estadoMaterias[materia.id];
        localStorage.setItem('estadoMaterias', JSON.stringify(estadoMaterias));
        renderMalla();
      });
    }

    secciones[materia.ciclo].appendChild(card);
  });
}

renderMalla();
