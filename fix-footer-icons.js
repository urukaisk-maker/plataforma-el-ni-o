const fs = require('fs');
const path = require('path');

function walk(dir) {
  let r = [];
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    const s = fs.statSync(p);
    if (s.isDirectory() && !p.includes('node_modules')) r.push(...walk(p));
    else if (p.endsWith('.html')) r.push(p);
  }
  return r;
}

const files = walk('e:/plataforma-gearmer-el-niño');
let count = 0;

const replacements = [
  [/\s*Explorar\s*<\/h3>/g, '🎮 Explorar</h3>'],
  [/\s*Misiones\s*<\/a>/g, '🎯 Misiones</a>'],
  [/\s*Cuentos\s*<\/a>/g, '📚 Cuentos</a>'],
  [/\s*Concursos\s*<\/a>/g, '🏆 Concursos</a>'],
  [/\s*YouTube\s*<\/a>/g, '📺 YouTube</a>'],
  [/\s*Películas\s*<\/a>/g, '🎬 Películas</a>'],
  [/\s*Recuerdos\s*<\/a>/g, '📸 Recuerdos</a>'],
  [/\s*Sorpresa\s*<\/a>/g, '🎁 Sorpresa</a>'],
  [/\s*Regalo digital\s*<\/a>/g, '🎉 Regalo digital</a>'],
  [/\s*Rincón gamer\s*<\/a>/g, '🕹️ Rincón gamer</a>'],
  [/\s*Legal & Proyecto\s*<\/h3>/g, '📋 Legal & Proyecto</h3>'],
  [/\s*Visión general\s*<\/a>/g, '🏗️ Visión general</a>'],
  [/\s*Panel de privacidad\s*<\/a>/g, '🛡️ Panel de privacidad</a>'],
  [/\s*Privacidad\s*<\/a>/g, '🔒 Privacidad</a>'],
  [/\s*Términos\s*<\/a>/g, '📄 Términos</a>'],
  [/\s*Cookies\s*<\/a>/g, '🍪 Cookies</a>'],
  [/\s*Descargar proyecto El Niño\s*<\/a>/g, '📥 Descargar proyecto El Niño</a>'],
  [/\s*Apoya el proyecto\s*<\/h3>/g, '☕ Apoya el proyecto</h3>'],
  [/\s*Arquitectura futura\s*<\/a>/g, '🏛️ Arquitectura futura</a>'],
  [/\s*GitHub\s*<\/a>/g, '💻 GitHub</a>'],
  [/Todos los recuerdos reservados/g, 'Todos los derechos reservados'],
];

for (const f of files) {
  let c = fs.readFileSync(f, 'utf8');
  let orig = c;
  for (const [regex, replacement] of replacements) {
    c = c.replace(regex, replacement);
  }
  if (c !== orig) {
    fs.writeFileSync(f, c, 'utf8');
    count++;
    console.log('Fixed:', path.basename(f));
  }
}
console.log('Total:', count);
