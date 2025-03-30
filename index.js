import { promises as fs } from "fs";

console.log("");

const logFile = "log.txt";

const getTimestamp = () =>
  new Date().toISOString().replace("T", " ").slice(0, 19);

const escribirLog = async (mensaje) => {
  console.log("=== EJERCICIO 1: Registro en log.txt ===");
  await fs.appendFile(logFile, `[${getTimestamp()}] - ${mensaje}\n`);
  console.log(mensaje);
};

(async () => {
  await escribirLog("Inicio del programa...");
  await escribirLog("Ejecutando tarea...");

  setTimeout(async () => {
    await escribirLog("Tarea completada.");
  }, 5000);
})();

const filename = "datos.txt";
const newFilename = "informacion.txt";

const manipularArchivo = async () => {
  console.log("=== EJERCICIO 2: Manipulación de datos.txt ===");
  try {
    await fs.writeFile(
      filename,
      `Nombre: Brandon Muñoz\nEdad: Tu 24\nCarrera: Tecnicatura Superior en Programación\n`
    );
    console.log("Archivo creado y datos escritos.");

    const content = await fs.readFile(filename, "utf8");
    console.log("Contenido del archivo:\n", content);

    await fs.appendFile(filename, `Fecha de modificación: ${getTimestamp()}\n`);
    console.log("Fecha de modificación agregada.");

    await fs.rename(filename, newFilename);
    console.log(`Archivo renombrado a ${newFilename}.`);

    setTimeout(async () => {
      await fs.unlink(newFilename);
      console.log(`Archivo ${newFilename} eliminado.`);
    }, 10000);
  } catch (error) {
    console.error("Error manipulando archivos:", error);
  }
};
manipularArchivo();

const contactFile = "contactos.json";

const asegurarArchivoContactos = async () => {
  console.log("=== EJERCICIO 3: Gestión de contactos ===");
  try {
    await fs.access(contactFile);
  } catch {
    await fs.writeFile(contactFile, JSON.stringify([], null, 4));
  }
};

const agregarContacto = async (nombre, telefono, email) => {
  try {
    await asegurarArchivoContactos();
    const contactos = JSON.parse(await fs.readFile(contactFile, "utf8"));
    contactos.push({ nombre, telefono, email });
    await fs.writeFile(contactFile, JSON.stringify(contactos, null, 4));
    console.log(`Contacto ${nombre} agregado.`);
  } catch (error) {
    console.error("Error al agregar contacto:", error);
  }
};

const mostrarContactos = async () => {
  try {
    await asegurarArchivoContactos();
    const contactos = JSON.parse(await fs.readFile(contactFile, "utf8"));
    console.log("Lista de contactos:", contactos);
  } catch (error) {
    console.error("Error al mostrar contactos:", error);
  }
};

const eliminarContacto = async (nombre) => {
  try {
    await asegurarArchivoContactos();
    let contactos = JSON.parse(await fs.readFile(contactFile, "utf8"));
    const nuevosContactos = contactos.filter(
      (contacto) => contacto.nombre !== nombre
    );

    if (contactos.length === nuevosContactos.length) {
      console.log(`No se encontró a ${nombre}.`);
      return;
    }

    await fs.writeFile(contactFile, JSON.stringify(nuevosContactos, null, 4));
    console.log(`Contacto ${nombre} eliminado.`);
  } catch (error) {
    console.error("Error al eliminar contacto:", error);
  }
};

// Código de prueba
(async () => {
  await agregarContacto("Carlos Perez", "2615845788", "carlosPe@gmail.com");
  await mostrarContactos();
  await eliminarContacto("Juan Pérez");
  await mostrarContactos();
})();

const contarPalabras = async () => {
  console.log("=== EJERCICIO 4: Contar palabras en un archivo ===");
  if (process.argv.length < 4) return;

  const archivo = process.argv[2];
  const palabra = process.argv[3].toLowerCase();

  try {
    const contenido = (await fs.readFile(archivo, "utf8")).toLowerCase();
    const regex = new RegExp(`\\b${palabra}\\b`, "g");
    const coincidencias = contenido.match(regex) || [];

    console.log(
      `La palabra "${palabra}" aparece ${coincidencias.length} veces en el archivo "${archivo}".`
    );
  } catch {
    console.log(`El archivo "${archivo}" no existe.`);
  }
};
contarPalabras();
